import { IsString } from 'class-validator';

export class VoteRestaurantDto {
  @IsString()
  restaurantId: string;
}
