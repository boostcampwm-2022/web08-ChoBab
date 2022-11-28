import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRoomDto } from '@room/dto/create-room.dto';
import { ResTemplate } from '@common/interceptors/template.interceptor';
import { RoomService } from '@room/room.service';
import { CustomException } from '@common/exceptions/custom.exception';
import { ConnectRoomDto } from './dto/connect-room.dto';
import { ROOM_EXCEPTION, ROOM_RES } from '@response/room';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<ResTemplate<any>> {
    const { lat, lng, radius } = createRoomDto;
    const roomCode = await this.roomService.createRoom(lat, lng, radius);
    return ROOM_RES.SUCCESS_CREATE_ROOM(roomCode);
  }

  @Get('valid')
  async validRoom(@Query('roomCode') roomCode: string) {
    const isRoomValid = await this.roomService.validRoom(roomCode);
    if (!isRoomValid) {
      throw new CustomException(ROOM_EXCEPTION.FAIL_VALID_ROOM);
    }

    return ROOM_RES.SUCCESS_VALID_ROOM;
  }

  @Post('connect')
  async connectRoom(@Body() connectRoomDto: ConnectRoomDto) {
    const { roomCode, userId } = connectRoomDto;
    // 위처럼 구조분해할당해서 쓰기 혹은 connectRoomDto.roomCode, connectRoomDto.userId 바로 사용하기 -> 멘토님 질문
    const isNewConnect = await this.roomService.connectUserToRoom(roomCode, userId);
    const roomInfo = await this.roomService.getRoomInfo(roomCode);
    if (!isNewConnect) {
      return { message: '이미 모임에 접속 중입니다.', data: { roomInfo } };
    }
    return { message: '성공적으로 모임에 접속했습니다.', data: { roomInfo } };
  }
}
