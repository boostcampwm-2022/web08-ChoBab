import { IsString } from 'class-validator';

export class ConnectRoomDto {
  @IsString()
  roomCode: string;

  @IsString()
  userId: string;
}
