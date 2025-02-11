import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadService {
  private readonly s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      endpoint: `${process.env.MINIO_ENDPOINT}`,
      accessKeyId: `${process.env.MINIO_ACCESS_KEY || 'adminuser'}`,
      secretAccessKey: `${process.env.MINIO_SECRET_KEY || 'supersecretpassword'}`,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3
        .headBucket({ Bucket: `${process.env.MINIO_BUCKET}` })
        .promise();
    } catch (err) {
      if (err.code === 'NotFound') {
        await this.s3
          .createBucket({ Bucket: `${process.env.MINIO_BUCKET}` })
          .promise();
      } else {
        throw err;
      }
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`.replace(/"/g, '');
    const params: AWS.S3.PutObjectRequest = {
      Bucket: `${process.env.MINIO_BUCKET}`,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3.putObject(params).promise();
      return fileName;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getFile(filename: string): Promise<string> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: `${process.env.MINIO_BUCKET}`,
      Key: filename,
    };

    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: params.Bucket,
        Key: params.Key,
        Expires: 60 * 60, // URL expires in 1 hour
      });
      return url;
    } catch (err) {
      console.error('Error generating file URL:', err);
      throw new InternalServerErrorException('Failed to generate file URL');
    }
  }
}
