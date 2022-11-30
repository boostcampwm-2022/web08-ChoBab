import { RESTAURANT_RES } from '@common/response/restaurant';
import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getRestaurantDetail(
    @Query('restaurantId') id: string, // 이후 상세 정보 캐싱을 위한 키값으로 이용될 예정
    @Query('name') name: string,
    @Query('address') address: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number
  ) {
    const { rating, openNow, priceLevel } = await this.restaurantService.getRestaurantDetail(
      id,
      address,
      name,
      lat,
      lng
    );

    return RESTAURANT_RES.SUCCESS_SEARCH_RESTAURANT_DETAIL(rating, openNow, priceLevel);
  }
}
