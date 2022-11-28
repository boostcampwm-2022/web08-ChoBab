import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './room.schema';
import { Model } from 'mongoose';
import { CustomException } from '@common/exceptions/custom.exception';
import { isInKorea } from '@utils/location';
import { LOCATION_EXCEPTION } from '@response/location';
import { ROOM_EXCEPTION } from '@response/room';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async createRoom(lat: number, lng: number): Promise<string> {
    if (!isInKorea(lat, lng)) {
      throw new CustomException(LOCATION_EXCEPTION.OUT_OF_KOREA);
    }

    try {
      const roomCode = uuid();
      await this.roomModel.create({ roomCode, lat, lng });

      return roomCode;
    } catch (error) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_CREATE_ROOM);
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
      throw new CustomException(ROOM_EXCEPTION.FAIL_SEARCH_ROOM);
    }
  }

  async getRoomInfo(roomCode: string): Promise<any> {
    try {
      const room = await this.roomModel.findOne({ roomCode });
      if (!room) {
        throw new CustomException(ROOM_EXCEPTION.IS_NOT_EXIST_ROOM);
      }
      if (room.deletedAt) {
        throw new CustomException(ROOM_EXCEPTION.ALREADY_DELETED_ROOM);
      }
      return { lat: room.lat, lng: room.lng };
    } catch (error) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_SEARCH_ROOM);
    }
  }
}
