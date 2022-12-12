import { IsNumber } from 'class-validator';

export class UserLocationDto {
  @IsNumber()
  userLat: number;

  @IsNumber()
  userLng: number;
}
