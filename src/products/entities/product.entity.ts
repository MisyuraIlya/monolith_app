import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Field, ObjectType, Float, ID } from '@nestjs/graphql';

export type ProductDocument = Product & Document;

@ObjectType() // Add this decorator
@Schema({ timestamps: true })
export class Product {
  @Prop({type:SchemaTypes.ObjectId, auto:true})
  @Field(() => ID) 
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field()
  @Prop({ required: true, unique: true })
  sku: string;

  @Field({ nullable: true })
  @Prop({ default: false })
  isPublished?: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
