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

@WebSocketGateway({ namespace: 'room' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    @InjectModel(RoomDynamic.name) private roomDynamicModel: Model<RoomDynamicDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>
  ) {}
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
    @MessageBody('userId') userId: string,
    @MessageBody('roomCode') roomCode: string,
    @MessageBody('userLat') userLat: number,
    @MessageBody('userLng') userLng: number
  ) {
    const user = { userId, userLat, userLng };
    console.log(userId, roomCode);
    client.join(roomCode);
    try {
      const { lat, lng } = await this.roomModel.findOne({ roomCode });
      const { restaurantList, userList, candidateList } = await this.roomDynamicModel.findOne({
        roomCode,
      });
      if (userList.filter((userData) => userData.userId === userId).length > 0) {
        client.emit('connectResult', {
          message: '이미 접속 중인 사용자입니다.',
          data: { roomCode, lat, lng, restaurantList, candidateList, userList },
        });
        return;
      }

      const newUserList = [...userList, user];
      await this.roomDynamicModel.findOneAndUpdate(
        { roomCode },
        {
          userList: newUserList,
        }
      );

      client.emit('connectResult', {
        message: '입장 성공',
        data: { roomCode, lat, lng, restaurantList, candidateList, userList: newUserList },
      });
    } catch (error) {
      client.emit('connectResult', { message: '방 접속에 실패했습니다.' });
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
