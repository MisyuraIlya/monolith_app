import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field()
  sku: string;

  @Field({ nullable: true })
  isPublished?: boolean;
}
