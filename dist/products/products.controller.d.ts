import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product | null>;
    create(createProductDto: Pick<Product, 'name' | 'description' | 'price'>, file?: Express.Multer.File): Promise<Product>;
    update(id: string, updateProductDto: Partial<Pick<Product, 'name' | 'description' | 'price' | 'image'>>, file?: Express.Multer.File): Promise<Product>;
    delete(id: string): Promise<Product>;
}
