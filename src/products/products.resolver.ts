import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { GetProductArgs } from './dto/args/get-product.args';
import { GetProductsArgs } from './dto/args/get-products.args';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  // Create a new product
  @Mutation(() => Product, { name: 'createProduct' })
  createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productsService.create(createProductInput);
  }

  // Fetch all products with filters, pagination, and sorting
  @Query(() => [Product], { name: 'products' })
  findAll(@Args() getProductsArgs: GetProductsArgs) {
    return this.productsService.findAll(getProductsArgs);
  }

  // Fetch a single product by ID
  @Query(() => Product, { name: 'product' })
  findOne(@Args() getProductArgs: GetProductArgs) {
    return this.productsService.findOne(getProductArgs.id);
  }

  @Mutation(() => Product, { name: 'updateProduct' }) // Correct name
  updateProduct(
    @Args('id', { type: () => String }) id: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(id, updateProductInput);
  }
  
  // Remove a product
  @Mutation(() => Boolean, { name: 'removeProduct' })
  removeProduct(@Args('id', { type: () => String }) id: string) {
    return this.productsService.remove(id);
  }
}
