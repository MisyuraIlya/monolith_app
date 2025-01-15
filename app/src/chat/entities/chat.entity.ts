import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class Chat extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true }) 
  sender: string;

  @Prop({ required: true }) 
  receiver: string;

  @Prop({ default: false }) 
  isRead: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
