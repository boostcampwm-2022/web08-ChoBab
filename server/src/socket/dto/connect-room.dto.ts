import { IsNumber, IsString } from 'class-validator';

export class ConnectRoomDto {
  @IsString()
  roomCode: string;

  @IsNumber()
  userLat: number;

  @IsNumber()
  userLng: number;
}
