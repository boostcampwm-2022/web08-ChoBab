import { Body, Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RestaurantService } from './restaurant.service';

/**
 * DTO: Data Transfer Object (데이터 계층 간 통신을 위한 객체)
 */
class GetRestaurantDto {
  lat: number;
  lng: number;
  radius: number;
  roomCode: string;
}

@Controller('/api/restaurant')
export class RestaurantController {
  constructor(private RestaurantService: RestaurantService, private ConfigService: ConfigService) {}
  @Post()
  async getRestaurantList(@Body() GetRestaurantDto: GetRestaurantDto) {
    const { lat, lng, radius, roomCode } = GetRestaurantDto;
    const apiKey = this.ConfigService.get('KAKAO_API_KEY');

    const restaurantList = this.RestaurantService.getRestaurantList(lat, lng, radius, apiKey);
    /**TODO: roomCode 사용해서 redis 저장 로직 추가하기 */
    return restaurantList;
  }
}
