import { Module } from '@nestjs/common';
import { EventsGateway } from '@socket/socket.gateway';

import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomDynamic, RoomDynamicSchema, RoomSchema } from '@room/room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: RoomDynamic.name, schema: RoomDynamicSchema },
    ]),
  ],
  controllers: [],
  providers: [EventsGateway],
})
export class SocketModule {}
