import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PaginationResponseDto } from 'src/modules/common/_dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateProductDto, FindAllProductDto } from 'src/modules/product/_dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, productData: CreateProductDto) {
    const checkSku = await Promise.all(
      productData.variants.map((variant) =>
        this.prisma.productVariant.findFirst({
          where: { sku: variant.sku },
        }),
      ),
    );
    const isSkuExist = checkSku.some((variant) => variant !== null);
    if (isSkuExist) {
      throw new BadRequestException('SKU already exists in the database');
    }
    return this.prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        imageUrls: {
          create: productData.imageUrls?.map((url) => ({ url })),
        },
        isActive: productData.isActive ?? true,
        sellerId: userId,
        variants: {
          create: productData.variants?.map((variant) => ({
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            imageUrl: variant.imageUrl,
            attributes: {
              create: variant.attributes?.map((attr) => ({
                name: attr.name,
              })),
            },
          })),
        },
      },
      include: {
        imageUrls: true,
        variants: {
          include: {
            attributes: true,
          },
        },
      },
    });
  }

  async findProductBySeller(sellerId: string, query: FindAllProductDto) {
    const {
      page = 1,
      size = 10,
      search,
      category,
      orderBy,
      startDate,
      endDate,
    } = query;

    const productWhereInput: Prisma.ProductWhereInput = {
      sellerId,
      ...(search
        ? {
            name: { contains: search, mode: 'insensitive' },
          }
        : {}),
      ...(category
        ? {
            category: { equals: category },
          }
        : {}),
      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: productWhereInput,
        skip: (page - 1) * size,
        take: size,
        include: {
          imageUrls: {
            select: { url: true },
          },
          variants: {
            include: {
              attributes: true,
            },
          },
        },
        orderBy: {
          createdAt: orderBy || 'desc',
        },
      }),

      this.prisma.product.count({
        where: productWhereInput,
      }),
    ]);

    return new PaginationResponseDto(products, total, { page, size });
  }
  async findProductByBuyer(query: FindAllProductDto) {
    const {
      page = 1,
      size = 10,
      search,
      category,
      orderBy,
      startDate,
      endDate,
    } = query;

    const productWhereInput: Prisma.ProductWhereInput = {
      ...(search
        ? {
            OR: [{ name: { contains: search, mode: 'insensitive' } }],
          }
        : {}),
      ...(category
        ? {
            category: { equals: category },
          }
        : {}),
      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: productWhereInput,
        skip: (page - 1) * size,
        take: size,
        include: {
          imageUrls: {
            select: { url: true },
          },
          variants: {
            include: {
              attributes: true,
            },
          },
        },
        orderBy: {
          createdAt: orderBy || 'desc',
        },
      }),

      this.prisma.product.count({
        where: productWhereInput,
      }),
    ]);

    return new PaginationResponseDto(products, total, { page, size });
  }

  async findById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        variants: {
          include: {
            attributes: true,
          },
        },
      },
    });
  }

  async findVariantBySku(sku: string) {
    return this.prisma.productVariant.findFirst({
      where: { sku },
    });
  }
}
