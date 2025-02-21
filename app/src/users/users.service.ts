import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto,tenantId?: string) {
    try {
      const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);
      const user = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        tenantId:tenantId,
      });
      return await user.save();
    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error}`);
    }
  }

  async findAll() {
    return this.userModel.find({});
  }

  async findOneAndThrowIfNull(query: FilterQuery<User>) {
    const user = (await this.userModel.findOne(query));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async findOne(query: FilterQuery<User>) {
    const user = (await this.userModel.findOne(query));
    return user;
  }

  update(query: FilterQuery<User>, data: UpdateQuery<User>) {
    return this.userModel.findOneAndUpdate(query, data);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
