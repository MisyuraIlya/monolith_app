import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        // new MaxFileSizeValidator({maxSize: 1000}),
        // new FileTypeValidator({fileType: 'image/jpeg'})
      ]
    })
  ) file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const fileName = await this.uploadService.uploadFile(file);
    return { fileName, message: 'File uploaded successfully' };
  }

  @Get('url')
  async getFile(@Query('fileName') fileName: string) {
    if (!fileName) {
      throw new BadRequestException('File name is required');
    }
    const fileUrl = await this.uploadService.getFile(fileName);
    return { fileName, url: fileUrl };
  }

}
