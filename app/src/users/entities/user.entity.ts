import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  refreshToken?: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  tenantId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
