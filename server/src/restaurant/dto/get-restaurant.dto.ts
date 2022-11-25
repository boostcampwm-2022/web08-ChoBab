import { IsNumber, IsString } from 'class-validator';

/**
 * DTO: Data Transfer Object (데이터 계층 간 통신을 위한 객체)
 */
export class GetRestaurantDto {
  @IsNumber()
  readonly lat: number;

  @IsNumber()
  readonly lng: number;

  @IsNumber()
  readonly radius: number;

  @IsString()
  readonly roomCode: string;
}
