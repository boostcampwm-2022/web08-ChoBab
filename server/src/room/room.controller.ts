import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRoomDto } from '@room/dto/create-room.dto';
import { ResTemplate } from '@common/interceptors/template.interceptor';
import { RoomService } from '@room/room.service';
import { CustomException } from '@common/exceptions/custom.exception';
import { ConnectRoomDto } from './dto/connect-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<ResTemplate<any>> {
    const { lat, lng, radius } = createRoomDto;
    const roomCode = await this.roomService.createRoom(lat, lng, radius);
    return { message: '성공적으로 모임방을 생성했습니다.', data: { roomCode } };
  }

  @Get('valid')
  async validRoom(@Query('roomCode') roomCode: string) {
    const isRoomValid = await this.roomService.validRoom(roomCode);
    if (!isRoomValid) {
      throw new CustomException('유효하지 않은 roomCode 입니다.');
    }

    return { message: '유효한 roomCode 입니다.', data: { isRoomValid } };
  }

  @Post('connect')
  async connectRoom(@Body() connectRoomDto: ConnectRoomDto) {
    const { roomCode, userId } = connectRoomDto;
    await this.roomService.connectUserToRoom(roomCode, userId);
    const roomInfo = await this.roomService.getRoomInfo(roomCode);
    return { message: '성공적으로 모임에 접속했습니다.', data: { roomInfo } };
  }
}
