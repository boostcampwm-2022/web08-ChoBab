import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
