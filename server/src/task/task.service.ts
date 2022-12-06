import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument, RoomDynamic, RoomDynamicDocument } from '@room/room.schema';
import { FilterQuery, Model } from 'mongoose';
import { ONE_DAY_MILLISECOND } from '@constants/time';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(RoomDynamic.name) private roomDynamicModel: Model<RoomDynamicDocument>
  ) {}

  /**
   * 매 시각 정각마다 실행하는 room 삭제 작업
   */
  @Cron(CronExpression.EVERY_HOUR)
  async deleteRoomCron() {
    this.logger.debug('[Delete Room Cron] Called every hour');
    const now = new Date();

    // 현재로 부터 1일 전 시간
    const criteria = new Date(now.getTime() - ONE_DAY_MILLISECOND);

    // 기준 시각 이전에 생성된 방을 찾을 때 필요한 조건
    const condition: FilterQuery<Room> = {
      $and: [{ createdAt: { $lt: criteria } }, { deletedAt: { $exists: false } }],
    };

    // 기준 시각 이전에 생성된 모임방(roomCode)에 해당하는 roomDynamic 삭제
    await this.roomModel.find(condition).then(async (rooms) => {
      await Promise.all(
        rooms.map(async (room) => {
          await this.roomDynamicModel.deleteOne({ roomCode: room.roomCode });
        })
      );
    });

    // 기준 시각 이전에 생성된 room soft delete
    await this.roomModel.updateMany(condition, { deletedAt: now });
  }
}
