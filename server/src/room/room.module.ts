import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RestaurantService } from '@restaurant/restaurant.service';
import { RedisModule } from '@cache/redis.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]), RedisModule],
  controllers: [RoomController],
  providers: [RoomService, RestaurantService],
})
export class RoomModule {}
