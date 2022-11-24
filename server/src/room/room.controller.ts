import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRoomDto } from '@room/dto/create-room.dto';
import { ResTemplate } from '@common/interceptors/template.interceptor';
import { RoomService } from '@room/room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<ResTemplate<any>> {
    const roomCode = await this.roomService.createRoom(createRoomDto.lat, createRoomDto.lng);
    return { message: '성공적으로 모임방을 생성했습니다.', data: { roomCode } };
  }

  @Get('valid')
  async validRoom(@Query('roomCode') roomCode: string) {
    const isRoomValid = await this.roomService.validRoom(roomCode);
    return {
      message: isRoomValid ? '유효한 roomCode 입니다.' : '유효하지 않은 roomCode 입니다.',
      data: { isRoomValid },
    };
  }
}
