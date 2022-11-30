import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetRestaurantDetailQueryDto {
  @IsString()
  restaurantId: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  lat: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  lng: number;
}
