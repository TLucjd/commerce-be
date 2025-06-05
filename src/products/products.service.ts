import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: Pick<Product, 'name' | 'description' | 'price'>, file?: Express.Multer.File): Promise<Product> {
    let imageUrl: string | undefined = undefined;

    if (file) {
      imageUrl = await this.uploadImage(file);
    }

    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price as any),
        image: imageUrl ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload result is undefined'));
          resolve(result.secure_url);
        }
      );

      const readableStream = new Readable();
      readableStream._read = () => {}; // _read is required but no-op is fine
      readableStream.push(file.buffer);
      readableStream.push(null);

      readableStream.pipe(uploadStream);
    });
  }

  async update(id: string, data: Partial<Pick<Product, 'name' | 'description' | 'price' | 'image'>> & { file?: Express.Multer.File }): Promise<Product> {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Product not found');
    let imageUrl = exists.image;

    // Handle new file upload
    if (data.file) {
      // If there's an old image, consider deleting it (optional, depending on requirements)
      // if (exists.image) {
      //   await this.deleteImageFromCloudinary(exists.image);
      // }
      imageUrl = await this.uploadImage(data.file);
    } else if (data.image === null || data.image === '') {
        // If image is explicitly set to null/empty and no new file, remove existing image
        if (exists.image) {
             // await this.deleteImageFromCloudinary(exists.image);
        }
        imageUrl = null;
    }

    // Prepare data for Prisma update, excluding the file
    const updateData: Partial<Product> = { ...data };
    delete (updateData as any).file;
    if (imageUrl !== undefined) { // Only update image if it was changed or set to null
        updateData.image = imageUrl;
    }

    return this.prisma.product.update({ where: { id }, data: updateData });
  }

  async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
