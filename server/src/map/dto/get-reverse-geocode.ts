import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetReverseGeocodeDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  lat: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  lng: number;
}
