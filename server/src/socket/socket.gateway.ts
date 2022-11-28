import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: 'room' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server; // namespace server instance

  private readonly COOKIE_SECRET: string;
  sessionMiddleware;

  constructor(private configService: ConfigService) {
    this.COOKIE_SECRET = this.configService.get('COOKIE_SECRET');
    this.sessionMiddleware = session({
      resave: false,
      saveUninitialized: true,
      secret: this.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
        // expires 를 따로 설정해주지 않으면 브라우저가 닫혔을 때 세션쿠키가 삭제되기 때문에
        // 적당한 세션쿠키 유효시간을 설정해 줌 (1시간)
        expires: new Date(Date.now() + 1000 * 60 * 60),
      },
    });
  }

  onModuleInit() {
    this.server.use((socket, next) => {
      console.log('session middleware');

      this.sessionMiddleware(socket.request, {}, next);
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
  handleClientToServerMessage(@MessageBody() data: any) {
    console.log('from client', data);
    this.server.emit('serverToClient', data);
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
