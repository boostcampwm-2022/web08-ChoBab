import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from '@room/room.schema';
import { FilterQuery, Model } from 'mongoose';
import { MONGO_TTL } from '@constants/time';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  /**
   * 매 시각 정각마다 실행하는 room 삭제 작업
   */
  @Cron(CronExpression.EVERY_HOUR)
  async deleteRoomCron() {
    this.logger.debug('[Delete Room Cron] Called every hour');
    const now = new Date();

    // 현재로 부터 6시간 전 시간
    const criteria = new Date(now.getTime() - MONGO_TTL);

    // 기준 시각 이전에 생성된 방을 찾을 때 필요한 조건
    const condition: FilterQuery<Room> = {
      $and: [{ createdAt: { $lt: criteria } }, { deletedAt: { $exists: false } }],
    };

    // 기준 시각 이전에 생성된 room soft delete
    await this.roomModel.updateMany(condition, { deletedAt: now });
  }
}
