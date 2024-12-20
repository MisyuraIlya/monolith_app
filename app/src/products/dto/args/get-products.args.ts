import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ArgsType()
export class GetProductsArgs {
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  @IsOptional()
  id?: string[];

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  sku?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isPublished?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  sortBy?: string;

  @Field({ nullable: true })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
