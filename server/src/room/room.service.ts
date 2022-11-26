import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument, RoomDynamic, RoomDynamicDocument } from './room.schema';
import { Model } from 'mongoose';
import { CustomException } from '@common/exceptions/custom.exception';
import { isInKorea } from '@utils/location';
import { RestaurantService } from '@restaurant/restaurant.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(RoomDynamic.name) private roomDynamicModel: Model<RoomDynamicDocument>,
    private restaurantService: RestaurantService
  ) {}

  async createRoom(lat: number, lng: number, radius: number): Promise<string> {
    if (!isInKorea(lat, lng)) {
      throw new CustomException('대한민국을 벗어난 입력입니다.');
    }

    try {
      const roomCode = uuid();
      await this.roomModel.create({ roomCode, lat, lng });
      const restaurantList = await this.restaurantService.getRestaurantList(lat, lng, radius);
      await this.roomDynamicModel.create({ roomCode, restaurantList });

      return roomCode;
    } catch (error) {
      throw new CustomException('모임방 생성에 실패했습니다.');
    }
  }

  async validRoom(roomCode: string): Promise<boolean> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
      if (!room || room.deletedAt) {
        return false;
      }
      return true;
    } catch (error) {
      throw new CustomException('모임방 검색에 실패했습니다.');
    }
  }

  async getRoomInfo(roomCode: string): Promise<any> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
      if (!room) {
        throw new CustomException('존재하지 않는 모임방입니다.');
      }
      if (room.deletedAt) {
        throw new CustomException('삭제된 모임방입니다.');
      }
      return { lat: room.lat, lng: room.lng };
    } catch (error) {
      throw new CustomException('모임방 검색에 실패했습니다.');
    }
  }
}
