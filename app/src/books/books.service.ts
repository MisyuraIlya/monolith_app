import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(@Inject('BOOK_MODEL') private bookModel: Model<Book>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findById(id).exec();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    return this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Book> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }
}
