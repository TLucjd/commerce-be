import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { File as MulterFile } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  async uploadFile(@UploadedFile() file: MulterFile) {
    const imageUrl = await this.uploadService.uploadImage(file);
    return { imageUrl };
  }
} 