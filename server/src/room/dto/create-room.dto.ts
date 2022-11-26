import { IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  readonly lat: number;

  @IsNumber()
  readonly lng: number;

  @IsNumber()
  readonly radius: number;
}
