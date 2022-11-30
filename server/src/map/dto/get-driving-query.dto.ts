import { Transform } from 'class-transformer';
import { IsNumber, Length } from 'class-validator';

export class GetDrivingQueryDto {
  @Transform(({ value }) => value.split(',').map((v) => Number(v)))
  @IsNumber({}, { each: true })
  start: number[];

  @Transform(({ value }) => value.split(',').map((v) => Number(v)))
  @IsNumber({}, { each: true })
  goal: number[];
}
