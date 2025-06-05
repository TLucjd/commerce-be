"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    }
    findOne(id) {
        return this.prisma.product.findUnique({ where: { id } });
    }
    async create(data, file) {
        let imageUrl = undefined;
        if (file) {
            imageUrl = await this.uploadImage(file);
        }
        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                image: imageUrl ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                if (error)
                    return reject(error);
                if (!result)
                    return reject(new Error('Upload result is undefined'));
                resolve(result.secure_url);
            });
            const readableStream = new stream_1.Readable();
            readableStream._read = () => { };
            readableStream.push(file.buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);
        });
    }
    async update(id, data) {
        const exists = await this.prisma.product.findUnique({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Product not found');
        let imageUrl = exists.image;
        if (data.file) {
            imageUrl = await this.uploadImage(data.file);
        }
        else if (data.image === null || data.image === '') {
            if (exists.image) {
            }
            imageUrl = null;
        }
        const updateData = { ...data };
        delete updateData.file;
        if (imageUrl !== undefined) {
            updateData.image = imageUrl;
        }
        return this.prisma.product.update({ where: { id }, data: updateData });
    }
    async delete(id) {
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map