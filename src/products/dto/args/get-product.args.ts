import { ArgsType, Field, Float, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetProductArgs {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field()
  sku: string;

  @Field()
  isPublished: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
