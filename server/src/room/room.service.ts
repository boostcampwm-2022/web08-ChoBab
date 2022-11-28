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
      const restaurantList = await this.restaurantService.getRestaurantList(lat, lng, radius);
      await this.roomDynamicModel.create({ roomCode, restaurantList });
      await this.roomModel.create({ roomCode, lat, lng });

      return roomCode;
    } catch (error) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_CREATE_ROOM);
    }
  }

  async validRoom(roomCode: string): Promise<boolean> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
      return !!room && !room.deletedAt;
    } catch (error) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_SEARCH_ROOM);
    }
  }
  async connectUserToRoom(roomCode: string, userId: string) {
    try {
      const { userList } = await this.roomDynamicModel.findOne({ roomCode });
      // 이미 사용자가 방에 접속해 있을 경우
      if (userList.includes(userId)) {
        return false;
      }
      await this.roomDynamicModel.findOneAndUpdate(
        { roomCode },
        { userList: [...userList, userId] }
      );
      return true;
    } catch (error) {
      throw new CustomException('사용자를 방에 입장 시키지 못했습니다.');
    }
  }

  /**TODO: room, roomDynamic 중 하나라도 없을 시 둘다 삭제하는 로직 추가 */
  async getRoomInfo(roomCode: string): Promise<any> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
      const { lng, lat, createdAt, deletedAt } = room;
      if (!room) {
        throw new CustomException(ROOM_EXCEPTION.IS_NOT_EXIST_ROOM);
      }
      if (deletedAt) {
        throw new CustomException(ROOM_EXCEPTION.ALREADY_DELETED_ROOM);
      }

      const roomDynamic = await this.roomDynamicModel.findOne({
        roomCode,
      });
      const { restaurantList, reserveList, userList } = roomDynamic;
      if (!roomDynamic) {
        throw new CustomException(ROOM_EXCEPTION.IS_NOT_EXIST_ROOM);
      }

      return { roomCode, createdAt, deletedAt, lat, lng, userList, restaurantList, reserveList };
    } catch (error) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_SEARCH_ROOM);
    }
  }
}
