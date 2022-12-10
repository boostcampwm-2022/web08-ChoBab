import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument, RoomDynamic, RoomDynamicDocument } from './room.schema';
import { Model } from 'mongoose';
import { CustomException } from '@common/exceptions/custom.exception';
import { isInKorea } from '@utils/location';
import { RestaurantService } from '@restaurant/restaurant.service';
import { LOCATION_EXCEPTION } from '@response/location';
import { ROOM_EXCEPTION } from '@response/room';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(RoomDynamic.name) private roomDynamicModel: Model<RoomDynamicDocument>,
    private restaurantService: RestaurantService
  ) {}

  async createRoom(lat: number, lng: number, radius: number): Promise<string> {
    if (!isInKorea(lat, lng)) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_KOREA);
    }

    try {
      const roomCode = uuid();
      const restaurantMap = await this.restaurantService.getRestaurantList(lat, lng, radius);
      const restaurantDetailList = await Promise.all(
        Object.keys(restaurantMap).map((restaurantId) => {
          const restaurant = restaurantMap[restaurantId];
          const { category } = restaurant;
          return this.restaurantService.getRestaurantDetail(restaurantId, category);
        })
      );
      const mergedRestaurantDataList = restaurantDetailList.map((restaurantDetailData) => {
        const { id } = restaurantDetailData;
        const restaurantData = restaurantMap[id];
        return { ...restaurantData, ...restaurantDetailData };
      });
      await this.roomDynamicModel.create({ roomCode, restaurantList: mergedRestaurantDataList });
      await this.roomModel.create({ roomCode, lat, lng });

      return roomCode;
    } catch (error) {
      console.log(error);
      throw new CustomException(ROOM_EXCEPTION.FAIL_CREATE_ROOM);
    }
  }

  async validRoom(roomCode: string): Promise<boolean> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
      if (!room || room.deletedAt) {
        await this.roomDynamicModel.findOneAndDelete({ roomCode });
        return false;
      }
      const roomDynamic = await this.roomDynamicModel.findOne({ roomCode });
      if (!roomDynamic) {
        await this.roomModel.findOneAndUpdate({ roomCode }, { deletedAt: Date.now() });
        return false;
      }

      return !!room && !room.deletedAt;
    } catch (error) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_SEARCH_ROOM);
    }
  }
}
