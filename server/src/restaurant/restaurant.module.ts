import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RestaurantService],
})
export class RestaurantModule {}
