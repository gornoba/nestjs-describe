import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageOptimizeService {
  async optimizeImage(image: Buffer): Promise<Buffer> {
    return await sharp(image).rotate().webp({ quality: 80 }).toBuffer();
  }
}
