import { Module } from '@nestjs/common';
import { EventsGateway } from './socket.gateway';

import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from '@room/room.schema';
import { RedisModule } from '@cache/redis.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]), RedisModule],
  controllers: [],
  providers: [EventsGateway],
})
export class SocketModule {}
