import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/input/create-product.input';
import { UpdateProductInput } from './dto/input/update-product.input';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { GetProductsArgs } from './dto/args/get-products.args';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const newProduct = new this.productModel(createProductInput);
    return newProduct.save();
  }

  async findAll(args: GetProductsArgs): Promise<Product[]> {
    const {
      id,
      title,
      sku,
      isPublished,
      minPrice,
      maxPrice,
      page,
      limit,
      sortBy,
      order,
    } = args;

    const filter: any = {};
    if (id) filter._id = { $in: id };
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (sku) filter.sku = sku;
    if (isPublished !== undefined) filter.isPublished = isPublished;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sort: Record<string, 1 | -1> = {};

    if (sortBy) {
      sort[sortBy] = order === 'DESC' ? -1 : 1;
    } else {
      sort['createdAt'] = -1; // Default sort
    }

    return this.productModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductInput, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return true;
  }
}
