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
import { Room, RoomDocument, RoomDynamic, RoomDynamicDocument } from '@room/room.schema';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { sessionMiddleware } from '@utils/session';
import { NextFunction, Request, Response } from 'express';
import { ConnectRoomDto } from '@socket/dto/connect-room.dto';
import { makeUserRandomNickname } from '@utils/nickname';
import { SOCKET_RES } from '@socket/socket.response';
import { CandidateType } from '@restaurant/restaurant';
import { VoteRestaurantDto } from '@socket/dto/vote-restaurant.dto';

interface VoteResultType {
  restaurantId: string;
  count: number;
}

@WebSocketGateway({ namespace: 'room' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server; // 'room' namespace server instance

  constructor(
    @InjectModel(RoomDynamic.name) private roomDynamicModel: Model<RoomDynamicDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>
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
      const { restaurantList, userList, candidateList } = await this.roomDynamicModel.findOne({
        roomCode,
      });

      const { sessionID: userId } = client.request;

      const userIds = userList.map((userData) => userData.userId);

      const userIndex = userIds.indexOf(userId);

      let user;
      let newUserList;

      if (userIndex !== -1) {
        user = userList[userIndex];
        newUserList = userList;
      } else {
        user = { userId, userLat, userLng, userName: makeUserRandomNickname() };
        newUserList = [...userList, user];
        await this.roomDynamicModel.findOneAndUpdate({ roomCode }, { userList: newUserList });
      }

      client.emit(
        'connectResult',
        SOCKET_RES.CONNECT_SUCCESS(
          roomCode,
          lat,
          lng,
          restaurantList,
          [], // TODO : 식당에 대한 좋아요 수 정보만 보내기
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
    console.log('voteRestaurant');
    const { restaurantId } = voteRestaurantDto;
    const roomCode = client.roomCode;
    const { candidateList } = await this.roomDynamicModel.findOne({
      roomCode,
    });

    // 후보 식당 리스트에 이미 식당 ID가 등록되어 있는지 확인
    const candidateIdx = candidateList.findIndex(
      (candidate) => candidate.restaurantId === restaurantId
    );

    if (candidateIdx === -1) {
      // 후보 식당 리스트에 식당 ID가 등록되어 있지 않은 경우
      const newCandidate: CandidateType = {
        restaurantId: restaurantId,
        usersSessionId: [client.sessionID],
      };
      const newCandidateList = [...candidateList, newCandidate];
      await this.roomDynamicModel.findOneAndUpdate(
        { roomCode },
        { candidateList: newCandidateList }
      );
    } else {
      // 후보 식당 리스트에 식당 ID가 등록되어 있는 경우

      // 해당 식당에 투표한 사용자 리스트에 현재 사용자가 있는지 확인
      if (
        candidateList[candidateIdx].usersSessionId.some(
          (userSessionId) => userSessionId === client.sessionID
        )
      ) {
        // 이미 투표한 사용자인 경우
        client.emit('voteRestaurantResult', SOCKET_RES.VOTE_RESTAURANT_FAIL);
        return;
      }

      // 투표한 사용자 리스트에 현재 사용자가 없는 경우
      candidateList[candidateIdx].usersSessionId.push(client.sessionID);
      await this.roomDynamicModel.findOneAndUpdate({ roomCode }, { candidateList: candidateList });
    }

    client.emit('voteRestaurantResult', SOCKET_RES.VOTE_RESTAURANT_SUCCESS(restaurantId));

    // 모임방의 모든 사용자들에게 투표 결과 전송
    this.server
      .in(roomCode)
      .emit('voteResultUpdate', { candidateList: this.getCurrentVoteResult(candidateList) });
    return;
  }

  // 식당 투표 취소
  @SubscribeMessage('cancelVoteRestaurant')
  async cancelVoteRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody() restaurantId: string
  ) {
    console.log('cancelVoteRestaurant');
    return;
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
      await this.roomDynamicModel.updateOne(
        { roomCode: roomCode },
        { $pull: { userList: { userId: sessionID } } }
      );

      client.to(roomCode).emit('leave', sessionID);
    }

    console.log('disconnected');
  }

  // 투표 결과 반환
  private getCurrentVoteResult = (candidateList: CandidateType[]) => {
    const voteResult: VoteResultType[] = [];
    candidateList.forEach((candidate) => {
      voteResult.push({
        restaurantId: candidate.restaurantId,
        count: candidate.usersSessionId.length,
      });
    });

    // 투표 결과를 내림차순으로 정렬
    candidateList.sort((a: CandidateType, b: CandidateType) => {
      return b.usersSessionId.length - a.usersSessionId.length;
    });
    return voteResult;
  };
}
