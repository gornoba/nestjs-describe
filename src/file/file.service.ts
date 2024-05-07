import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import aws from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Request, Response } from 'express';

@Injectable()
export class FileService {
  private s3: aws.S3;
  private awsConfig = this.configService.get('AWS');

  constructor(private readonly configService: ConfigService) {
    this.s3 = this.awsConfig && new aws.S3(this.awsConfig);
  }

  async streamFile(fullPath: string, req: Request, res: Response) {
    const file = await this.s3
      .getObject({ Bucket: this.awsConfig.bucket, Key: fullPath })
      .promise();

    const fileStream = this.s3
      .getObject({ Bucket: this.awsConfig.bucket, Key: fullPath })
      .createReadStream();

    const allowOrigins = this.configService.get('CORS_ORIGIN')
      ? this.configService.get('CORS_ORIGIN').split(',')
      : ['*'];
    const origin = req.headers.origin || '*';

    if (allowOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', file.ContentType);
    res.setHeader('Content-Length', file.ContentLength);

    fileStream.pipe(res);
  }

  async uploadFile(fullPath: string, file: Express.Multer.File) {
    const params: PutObjectRequest = {
      Bucket: this.awsConfig.bucket,
      Key: fullPath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.upload(params).promise();

    return fullPath;
  }

  async deleteFile(fullPath: string) {
    await this.s3
      .deleteObject({ Bucket: this.awsConfig.bucket, Key: fullPath })
      .promise();
  }

  async listFile(folder: string) {
    const params = {
      Bucket: this.awsConfig.bucket,
      Prefix: folder,
    };

    const data = await this.s3.listObjectsV2(params).promise();

    return data.Contents.map((content) => content.Key);
  }
}
