import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomDynamic, RoomDynamicSchema, RoomSchema } from '@room/room.schema';
import { RoomController } from '@room/room.controller';
import { RoomService } from '@room/room.service';
import { RestaurantModule } from '@restaurant/restaurant.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: RoomDynamic.name, schema: RoomDynamicSchema },
    ]),
    RestaurantModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
