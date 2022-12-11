import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RedisModule } from '@cache/redis.module';
import { RestaurantModule } from '@restaurant/restaurant.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    RedisModule,
    RestaurantModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
