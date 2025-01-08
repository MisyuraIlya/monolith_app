import { InternalServerErrorException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Book, BookSchema } from 'src/books/entities/book.entity';

export const tenantModels = {
  bookModel: {
    provide: 'BOOK_MODEL',
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Book.name, BookSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};