import { InjectModel } from '@nestjs/mongoose';
import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Room, RoomDocument, RoomDynamic, RoomDynamicDocument } from '@room/room.schema';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { sessionMiddleware } from '@utils/session';
import { Request, Response, NextFunction } from 'express';
import { PreprocessedRestaurantType as RestaurantType } from '@restaurant/restaurant';
import { ConnectRoomDto } from '@socket/dto/connect-room.dto';
import { makeUserRandomNickname } from '@utils/nickname';

interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
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

  private socketRes() {
    const dataTemplate = (message: string, data?: unknown) => {
      if (!data) {
        return { message };
      }
      return {
        message,
        data,
      };
    };
    return {
      CONNECT_FAIL: dataTemplate('접속 실패'),
      CONNECT_SUCCESS: (
        roomCode: string,
        lat: number,
        lng: number,
        restaurantList: RestaurantType[],
        candidateList: RestaurantType[],
        userList: UserType[],
        userId: string,
        userName: string
      ) =>
        dataTemplate('접속 성공', {
          roomCode,
          lat,
          lng,
          restaurantList,
          candidateList,
          userList,
          userId,
          userName,
        }),
    };
  }

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

    const { CONNECT_SUCCESS, CONNECT_FAIL } = this.socketRes();

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
        CONNECT_SUCCESS(
          roomCode,
          lat,
          lng,
          restaurantList,
          candidateList,
          newUserList,
          user.userId,
          user.userName
        )
      );

      client.to(roomCode).emit('join', user); // 자신을 제외하네?
    } catch (error) {
      client.emit('connectResult', CONNECT_FAIL);
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
  async voteRestaurant(@ConnectedSocket() client: Socket, @MessageBody() restaurantId: string) {
    console.log('voteRestaurant');
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
}
