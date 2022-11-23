import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './room.schema';
import { Model } from 'mongoose';
import { CustomException } from '@common/exceptions/custom.exception';
import { isInKorea } from '@util/location';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async createRoom(lat: number, lng: number): Promise<string> {
    if (!isInKorea(lat, lng)) {
      throw new CustomException('대한민국을 벗어난 입력입니다.');
    }

    try {
      const roomCode = uuid();
      await this.roomModel.create({ roomCode, lat, lng });

      return roomCode;
    } catch (error) {
      throw new CustomException('모임방 생성에 실패했습니다.');
    }
  }
}
