import { Module } from '@nestjs/common';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [RestaurantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
