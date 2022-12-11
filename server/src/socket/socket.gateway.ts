import { InjectModel } from '@nestjs/mongoose';
import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Room, RoomDocument } from '@room/room.schema';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { sessionMiddleware } from '@utils/session';
import { NextFunction, Request, Response } from 'express';
import { ConnectRoomDto } from '@socket/dto/connect-room.dto';
import { makeUserRandomNickname } from '@utils/nickname';
import { RedisService } from '@cache/redis.service';

import { SOCKET_RES } from '@socket/socket.response';
import { VoteRestaurantDto } from '@socket/dto/vote-restaurant.dto';
import { VoteResultType } from '@socket/socket';

@WebSocketGateway({ namespace: 'room' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server; // 'room' namespace server instance

  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    private readonly redisService: RedisService
  ) {}

  onModuleInit() {
    this.server.use((socket, next) => {
      sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
    });

    this.server.use((socket: Socket, next) => {
      const req = socket.request;

      Object.assign(socket, { sessionID: req.sessionID });

      next();
    });
  }

  @SubscribeMessage('connectRoom')
  async handleConnectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() connectRoomDto: ConnectRoomDto
  ) {
    const { roomCode, userLat, userLng } = connectRoomDto;

    client.roomCode = roomCode;

    client.join(roomCode);

    try {
      const { lat, lng } = await this.roomModel.findOne({ roomCode });
      const restaurantList = await this.redisService.restaurantList.getRestaurantListForRoom(
        roomCode
      );
      const { sessionID: userId } = client.request;
      const user = { userId, userLat, userLng, userName: makeUserRandomNickname() };
      await this.redisService.joinList.addUserToJoinList(roomCode, user);
      const newUserList = await this.redisService.joinList.getJoinList(roomCode);

      client.emit(
        'connectResult',
        SOCKET_RES.CONNECT_SUCCESS(
          roomCode,
          lat,
          lng,
          restaurantList,
          newUserList,
          user.userId,
          user.userName
        )
      );

      client.to(roomCode).emit('join', user); // 자신을 제외하네?
    } catch (error) {
      client.emit('connectResult', SOCKET_RES.CONNECT_FAIL);
    }
  }

  afterInit() {
    console.log('connection initialize');
  }

  handleConnection() {
    console.log('connected');
  }

  // 식당 투표
  @SubscribeMessage('voteRestaurant')
  async voteRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody() voteRestaurantDto: VoteRestaurantDto
  ) {
    const { restaurantId } = voteRestaurantDto;
    const roomCode = client.roomCode;

    try {
      const voteResult = await this.redisService.candidateList.voteCandidate(
        roomCode,
        client.sessionID,
        restaurantId
      );
      if (!voteResult) {
        throw new Error();
      }

      client.emit('voteRestaurantResult', SOCKET_RES.VOTE_RESTAURANT_SUCCESS(restaurantId));

      // 식당 투표 성공 시 - 클라이언트에게 사용자가 투표한 식당의 id 리스트 전송
      this.getUserVoteRestaurantIdList(client);

      const candidateList = await this.redisService.candidateList.getCandidateList(roomCode);

      const voteCountResult = this.getCurrentVoteResult(candidateList);

      // 모임방의 모든 사용자들에게 투표 현황 전송
      this.server
        .in(roomCode)
        .emit('voteResultUpdate', SOCKET_RES.UPDATE_VOTE_RESULT(voteCountResult));
    } catch (error) {
      client.emit('voteRestaurantResult', SOCKET_RES.VOTE_RESTAURANT_FAIL);
    }
  }

  // 식당 투표 취소
  @SubscribeMessage('cancelVoteRestaurant')
  async cancelVoteRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody() voteRestaurantDto: VoteRestaurantDto
  ) {
    const { restaurantId } = voteRestaurantDto;
    const roomCode = client.roomCode;

    try {
      const voteResult = await this.redisService.candidateList.cancelVoteCandidate(
        roomCode,
        client.sessionID,
        restaurantId
      );

      if (!voteResult) {
        throw new Error();
      }

      client.emit(
        'cancelVoteRestaurantResult',
        SOCKET_RES.CANCEL_VOTE_RESTAURANT_SUCCESS(restaurantId)
      );

      // 식당 투표 취소 성공 시 - 클라이언트에게 사용자가 투표한 식당의 id 리스트 전송
      this.getUserVoteRestaurantIdList(client);

      const candidateList = await this.redisService.candidateList.getCandidateList(roomCode);

      const voteCountResult = this.getCurrentVoteResult(candidateList);

      // 모임방의 모든 사용자들에게 투표 현황 전송
      this.server
        .in(roomCode)
        .emit('voteResultUpdate', SOCKET_RES.UPDATE_VOTE_RESULT(voteCountResult));
    } catch (error) {
      client.emit('cancelVoteRestaurantResult', SOCKET_RES.CANCEL_VOTE_RESTAURANT_FAIL);
    }
  }

  // 현재 투표 현황 요청
  @SubscribeMessage('getVoteResult')
  async getVoteResult(@ConnectedSocket() client: Socket) {
    const roomCode = client.roomCode;
    const candidateList = await this.redisService.candidateList.getCandidateList(roomCode);

    client.emit(
      'currentVoteResult',
      SOCKET_RES.CURRENT_VOTE_RESULT(this.getCurrentVoteResult(candidateList))
    );
  }

  // 사용자가 투표한 식당의 id 리스트 요청
  @SubscribeMessage('getUserVoteRestaurantIdList')
  async getUserVoteRestaurantIdList(@ConnectedSocket() client: Socket) {
    const roomCode = client.roomCode;
    const candidateList = await this.redisService.candidateList.getCandidateList(roomCode);

    // 사용자가 투표한 음식점 리스트
    const userVoteRestaurantIdList = Object.keys(candidateList).filter((restaurantId) =>
      candidateList[restaurantId].find((userId) => userId === client.sessionID)
    );

    client.emit(
      'userVoteRestaurantIdList',
      SOCKET_RES.USER_VOTE_RESTAURANT_ID_LIST(userVoteRestaurantIdList)
    );
  }

  async handleDisconnect(client: Socket) {
    const { sessionID, roomCode } = client;

    // 같은 방의 접속자 세션 아이디를 전부 가져오는 작업
    const roomSessionIDs =
      this.server.sockets instanceof Map
        ? [...this.server.sockets]
            .filter(([key, value]) => value.roomCode === roomCode)
            .map(([key, value]) => value.sessionID)
        : [];

    // 방안에 같은 세션 접속자가 없을 때 퇴장 처리 (DB, Client 에서 모두 제거)
    if (!roomSessionIDs.includes(sessionID)) {
      await this.redisService.joinList.delUserToJoinList(roomCode, sessionID);

      client.to(roomCode).emit('leave', sessionID);
    }

    console.log('disconnected');
  }

  // 투표 현황 데이터 가공 함수
  private getCurrentVoteResult = (candidateList: { [index: string]: string[] }) => {
    const voteResult: VoteResultType[] = [];
    Object.keys(candidateList).forEach((restaurantId) => {
      if (!candidateList[restaurantId].length) {
        return;
      }
      voteResult.push({
        restaurantId,
        count: candidateList[restaurantId].length,
      });
    });

    return voteResult;
  };
}
