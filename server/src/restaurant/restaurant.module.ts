import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategorySchema } from '@restaurant/restaurant.schema';
import { RestaurantService } from '@restaurant/restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RestaurantCategory.name, schema: RestaurantCategorySchema },
    ]),
  ],
  controllers: [],
  providers: [RestaurantService],
  exports: [RestaurantService],
})
export class RestaurantModule {}
