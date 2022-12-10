import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantCategoryDocument = RestaurantCategory & Document;

@Schema()
export class RestaurantCategory {
  @Prop({ required: true, unique: true })
  category: string;

  @Prop({ required: true, default: [] })
  photoUrl: [string];
}

export const RestaurantCategorySchema = SchemaFactory.createForClass(RestaurantCategory);
