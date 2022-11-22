import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

interface IPos {
  longitude: number;
  latitude: number;
}

@Schema()
export class Room {
  @Prop({ required: true, unique: true })
  roomCode: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  pos: IPos;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
