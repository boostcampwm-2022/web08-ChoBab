import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantCategory, RestaurantCategorySchema } from './restaurant.schema';
import { RestaurantService } from './restaurant.service';

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
