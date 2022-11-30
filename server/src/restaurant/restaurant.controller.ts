import { RESTAURANT_RES } from '@common/response/restaurant';
import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getRestaurantDetail(
    @Query('restaurantId') id: string,
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
