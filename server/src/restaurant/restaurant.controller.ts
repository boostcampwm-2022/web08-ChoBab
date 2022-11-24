import { Body, Controller, Post } from '@nestjs/common';
import { GetRestaurantDto } from './dto/get-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}
  @Post()
  async getRestaurantList(@Body() getRestaurantDto: GetRestaurantDto) {
    const { lat, lng, radius, roomCode } = getRestaurantDto;

    const restaurantList = this.restaurantService.getRestaurantList(lat, lng, radius);
    /**TODO: roomCode 사용해서 redis 저장 로직 추가하기 */
    return restaurantList;
  }
}
