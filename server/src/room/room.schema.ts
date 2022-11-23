import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

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

export const RoomSchema = SchemaFactory.createForClass(Room);
