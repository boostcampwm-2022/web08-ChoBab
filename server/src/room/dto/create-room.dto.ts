import { DEFAULT_RADIUS } from '@constants/location';
import { IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  readonly lat: number;

  @IsNumber()
  readonly lng: number;

  @IsNumber()
  readonly radius: number = DEFAULT_RADIUS;
}
