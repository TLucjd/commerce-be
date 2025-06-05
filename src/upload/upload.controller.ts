// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';
// import { File as MulterFile } from 'multer'; // Removed, not needed

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(), // bắt buộc để có file.buffer
      limits: { fileSize: 5 * 1024 * 1024 }, // optional: giới hạn file 5MB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.uploadService.uploadImage(file);
  }
}
