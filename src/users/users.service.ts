import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    }).save();
  }

  async findAll() {
    return this.userModel.find({})
  }

  async findOne(query: FilterQuery<User>) {
    const user = (await this.userModel.findOne(query)).toObject();
    if(!user){
      throw new NotFoundException("user not found")
    }
    return user;
  }

  update(query: FilterQuery<User>, data: UpdateQuery<User>) {
    return this.userModel.findOneAndUpdate(query,data);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
