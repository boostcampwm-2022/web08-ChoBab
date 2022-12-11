import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomDynamic, RoomDynamicSchema, RoomSchema } from './room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RestaurantService } from '@restaurant/restaurant.service';
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
