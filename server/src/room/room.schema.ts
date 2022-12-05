import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MergedRestaurantType as RestaurantType } from '@restaurant/restaurant';

export type RoomDocument = Room & Document;
export type RoomDynamicDocument = RoomDynamic & Document;

interface UserType {
  userId: string;
  userLat: number;
  userLng: number;
  userName: string;
}

@Schema()
export class Room {
  @Prop({ required: true, unique: true })
  roomCode: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ required: true })
  lng: number;

  @Prop({ required: true })
  lat: number;
}

@Schema()
export class RoomDynamic {
  @Prop({ required: true, unique: true })
  roomCode: string;

  @Prop({ required: true, default: [] })
  userList: [UserType];

  @Prop({ required: true, default: [] })
  restaurantList: [RestaurantType];

  @Prop({ required: true, default: [] })
  candidateList: [RestaurantType];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
export const RoomDynamicSchema = SchemaFactory.createForClass(RoomDynamic);
