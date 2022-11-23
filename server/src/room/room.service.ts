import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './room.schema';
import { Model } from 'mongoose';
import { CustomException } from '@common/exceptions/custom.exception';

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async createRoom(lat: number, lng: number): Promise<string> {
    // TODO : lat, lng 범위 검증

    try {
      const roomCode = uuid();
      await this.roomModel.create({ roomCode, lat, lng });

      return roomCode;
    } catch (error) {
      throw new CustomException('모임방 생성에 실패했습니다.');
    }
  }
}
