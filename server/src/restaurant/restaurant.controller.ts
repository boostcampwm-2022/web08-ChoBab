import { Body, Controller, Post } from '@nestjs/common';
import 'dotenv/config';
import { restaurant } from './restaurant';
import { RestaurantService } from './restaurant.service';

/**
 * DTO: Data Transfer Object (데이터 계층 간 통신을 위한 객체)
 */
class GetRestaurantDto {
  latitude: string;
  longitude: string;
  radius: string;
  roomCode: string;
}

@Controller('/api/restaurant')
export class RestaurantController {
  constructor(private RestaurantService: RestaurantService) {}
  @Post()
  async getRestaurantList(@Body() GetRestaurantDto: GetRestaurantDto): Promise<restaurant[]> {
    const { latitude, longitude, radius, roomCode } = GetRestaurantDto;
    const apiKey = process.env.KAKAO_API_KEY;

    const restaurantList = this.RestaurantService.getRestaurantList(
      latitude,
      longitude,
      radius,
      apiKey
    );
    /**TODO: roomCode 사용해서 redis 저장 로직 추가하기 */
    return restaurantList;
  }
}
