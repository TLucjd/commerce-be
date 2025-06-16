import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product | null>;
    create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product>;
    update(id: string, updateProductDto: Partial<Pick<Product, 'name' | 'description' | 'price' | 'image'>>, file?: Express.Multer.File): Promise<Product>;
    delete(id: string): Promise<Product>;
}
