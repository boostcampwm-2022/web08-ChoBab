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
import { VoteResultType } from '@socket/socket';

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

      candidateList.push(newCandidate);

      await this.roomDynamicModel.findOneAndUpdate({ roomCode }, { candidateList });
    } else {
      // 후보 식당 리스트에 식당 ID가 등록되어 있는 경우

      // 해당 식당에 투표한 사용자 리스트에 현재 사용자가 있는지 확인
      const isUserVoted = candidateList[candidateIdx].usersSessionId.some(
        (userSessionId) => userSessionId === client.sessionID
      );
      if (isUserVoted) {
        client.emit('voteRestaurantResult', SOCKET_RES.VOTE_RESTAURANT_FAIL);
        return;
      }

      // 투표한 사용자 리스트에 현재 사용자가 없는 경우
      candidateList[candidateIdx].usersSessionId.push(client.sessionID);
      await this.roomDynamicModel.findOneAndUpdate({ roomCode }, { candidateList: candidateList });
    }

    client.emit('voteRestaurantResult', SOCKET_RES.VOTE_RESTAURANT_SUCCESS(restaurantId));

    // 식당 투표 성공 시 - 클라이언트에게 사용자가 투표한 식당의 id 리스트 전송
    this.getUserVoteRestaurantIdList(client);

    const voteResult = this.getCurrentVoteResult(candidateList);

    // 모임방의 모든 사용자들에게 투표 현황 전송
    this.server.in(roomCode).emit('voteResultUpdate', SOCKET_RES.UPDATE_VOTE_RESULT(voteResult));
  }

  // 식당 투표 취소
  @SubscribeMessage('cancelVoteRestaurant')
  async cancelVoteRestaurant(
    @ConnectedSocket() client: Socket,
    @MessageBody() voteRestaurantDto: VoteRestaurantDto
  ) {
    const { restaurantId } = voteRestaurantDto;
    const roomCode = client.roomCode;
    const { candidateList } = await this.roomDynamicModel.findOne({
      roomCode,
    });

    // 후보 식당 리스트에 식당 ID가 등록되어 있는지 확인
    const candidateIdx = candidateList.findIndex(
      (candidate) => candidate.restaurantId === restaurantId
    );

    // 후보 식당 리스트에 식당 ID가 등록되어 있지 않은 경우
    if (candidateIdx === -1) {
      client.emit('cancelVoteRestaurantResult', SOCKET_RES.CANCEL_VOTE_RESTAURANT_FAIL);
      return;
    }

    // 해당 식당에 투표한 사용자 리스트에 현재 사용자가 있는지 확인
    const isUserVoted = candidateList[candidateIdx].usersSessionId.some(
      (userSessionId) => userSessionId === client.sessionID
    );

    if (!isUserVoted) {
      // 투표한 사용자 리스트에 현재 사용자가 없는 경우
      client.emit('cancelVoteRestaurantResult', SOCKET_RES.CANCEL_VOTE_RESTAURANT_FAIL);
      return;
    }

    // 투표한 사용자 리스트에 현재 사용자가 있는 경우
    candidateList[candidateIdx].usersSessionId = candidateList[candidateIdx].usersSessionId.filter(
      (userSessionId) => userSessionId !== client.sessionID
    );

    // 투표 취소로 인해 후보 식당의 투표 수가 0이 되는 경우
    if (candidateList[candidateIdx].usersSessionId.length === 0) {
      candidateList.splice(candidateIdx, 1);
    }

    await this.roomDynamicModel.findOneAndUpdate({ roomCode }, { candidateList: candidateList });

    // 투표 취소를 요청한 사용자에게 처리 결과(성공적으로 처리됨) 전송
    client.emit(
      'cancelVoteRestaurantResult',
      SOCKET_RES.CANCEL_VOTE_RESTAURANT_SUCCESS(restaurantId)
    );

    // 식당 투표 취소 성공 시 - 클라이언트에게 사용자가 투표한 식당의 id 리스트 전송
    this.getUserVoteRestaurantIdList(client);

    const voteResult = this.getCurrentVoteResult(candidateList);

    // 모임방의 모든 사용자들에게 투표 현황 전송
    this.server.in(roomCode).emit('voteResultUpdate', SOCKET_RES.UPDATE_VOTE_RESULT(voteResult));
  }

  // 현재 투표 현황 요청
  @SubscribeMessage('getVoteResult')
  async getVoteResult(@ConnectedSocket() client: Socket) {
    const roomCode = client.roomCode;
    const data = await this.roomDynamicModel.findOne({
      roomCode,
    });

    const candidateList = data ? data.candidateList : [];
    client.emit(
      'currentVoteResult',
      SOCKET_RES.CURRENT_VOTE_RESULT(this.getCurrentVoteResult(candidateList || []))
    );
  }

  // 사용자가 투표한 식당의 id 리스트 요청
  @SubscribeMessage('getUserVoteRestaurantIdList')
  async getUserVoteRestaurantIdList(@ConnectedSocket() client: Socket) {
    const roomCode = client.roomCode;
    const { candidateList } = await this.roomDynamicModel.findOne({
      roomCode,
    });

    // 사용자가 투표한 식당의 id 리스트
    const userVoteRestaurantIdList = candidateList
      .filter((candidate) =>
        candidate.usersSessionId.some((userSessionId) => userSessionId === client.sessionID)
      )
      .map((candidate) => candidate.restaurantId);

    console.log(userVoteRestaurantIdList);

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
      await this.roomDynamicModel.updateOne(
        { roomCode: roomCode },
        { $pull: { userList: { userId: sessionID } } }
      );

      client.to(roomCode).emit('leave', sessionID);
    }

    console.log('disconnected');
  }

  // 투표 현황 데이터 가공 및 정렬 함수
  private getCurrentVoteResult = (candidateList: CandidateType[]) => {
    const voteResult: VoteResultType[] = [];
    candidateList.forEach((candidate) => {
      voteResult.push({
        restaurantId: candidate.restaurantId,
        count: candidate.usersSessionId.length,
      });
    });

    // // 투표 현황 내림차순 정렬
    // voteResult.sort((a: VoteResultType, b: VoteResultType) => b.count - a.count);
    return voteResult;
  };
}
