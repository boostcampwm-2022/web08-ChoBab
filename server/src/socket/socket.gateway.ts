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
import { preprocessedRestaurantType as RestaurantType } from '@restaurant/restaurant';

interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
}

@WebSocketGateway({ namespace: 'room' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
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
        userList: UserType[]
      ) =>
        dataTemplate('접속 성공', { roomCode, lat, lng, restaurantList, candidateList, userList }),
    };
  }

  @WebSocketServer()
  server: Server; // namespace server instance

  onModuleInit() {
    this.server.use((socket, next) => {
      sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
    });

    this.server.use((socket: Socket, next) => {
      const req = socket.request;

      console.log('session id', req.sessionID);
      console.log('session data', req.session);

      Object.assign(socket, { sessionID: req.sessionID });

      next();
    });
  }

  @SubscribeMessage('clientToServer')
  handleClientToServerMessage(client: Socket, data: any) {
    const req = client.request;

    console.log('session id', req.sessionID);
    console.log('session data', req.session);

    console.log('from client', data);
    this.server.emit('serverToClient', data);
  }

  @SubscribeMessage('connectRoom')
  async handleConnectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomCode') roomCode: string,
    @MessageBody('userLat') userLat: number,
    @MessageBody('userLng') userLng: number
  ) {
    const { sessionID: userId } = client.request;
    const user = { userId, userLat, userLng };
    const { CONNECT_SUCCESS, CONNECT_FAIL } = this.socketRes();
    console.log(userId, roomCode);
    client.join(roomCode);
    try {
      const { lat, lng } = await this.roomModel.findOne({ roomCode });
      const { restaurantList, userList, candidateList } = await this.roomDynamicModel.findOne({
        roomCode,
      });
      if (userList.filter((userData) => userData.userId === userId).length > 0) {
        client.emit(
          'connectResult',
          CONNECT_SUCCESS(roomCode, lat, lng, restaurantList, candidateList, userList)
        );
        return;
      }

      const newUserList = [...userList, user];
      await this.roomDynamicModel.findOneAndUpdate(
        { roomCode },
        {
          userList: newUserList,
        }
      );

      client.emit(
        'connectResult',
        CONNECT_SUCCESS(roomCode, lat, lng, restaurantList, candidateList, newUserList)
      );
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

  handleDisconnect() {
    console.log('disconnected');
  }
}
