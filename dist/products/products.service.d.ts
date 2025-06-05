import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product | null>;
    create(data: Pick<Product, 'name' | 'description' | 'price'>, file?: Express.Multer.File): Promise<Product>;
    uploadImage(file: Express.Multer.File): Promise<string>;
    update(id: string, data: Partial<Pick<Product, 'name' | 'description' | 'price' | 'image'>> & {
        file?: Express.Multer.File;
    }): Promise<Product>;
    delete(id: string): Promise<Product>;
}
