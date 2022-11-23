import { Body, Controller, Post } from '@nestjs/common';
import { GetRestaurantDto } from './dto/get-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private RestaurantService: RestaurantService) {}
  @Post()
  async getRestaurantList(@Body() GetRestaurantDto: GetRestaurantDto) {
    const { lat, lng, radius, roomCode } = GetRestaurantDto;

    const restaurantList = this.RestaurantService.getRestaurantList(lat, lng, radius);
    /**TODO: roomCode 사용해서 redis 저장 로직 추가하기 */
    return restaurantList;
  }
}
