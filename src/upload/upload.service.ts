import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: { buffer: Buffer; [key: string]: any }): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) return reject(new Error('Upload failed or secure_url missing'));
          resolve(result.secure_url);
        },
      );

      const fileStream = new Readable();
      fileStream.push(file.buffer);
      fileStream.push(null);

      fileStream.pipe(uploadStream);
    });
  }
} 