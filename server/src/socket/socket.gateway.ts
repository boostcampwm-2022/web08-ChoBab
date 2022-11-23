import {
  MessageBody,
  SubscribeMessage,
  OnGatewayInit,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'room' })
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('connection initialize');
  }

  handleConnection() {
    console.log('connected');
  }

  @SubscribeMessage('clientToServer')
  handleClientToServerMessage(@MessageBody() data) {
    console.log('from client', data);
    this.server.emit('serverToClient', data);
  }

  handleDisconnect() {
    console.log('disconnected');
  }
}
