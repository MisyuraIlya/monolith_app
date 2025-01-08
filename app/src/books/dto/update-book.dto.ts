import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {
    readonly name?: string;
    readonly description?: string;
    readonly price?: number;
}
