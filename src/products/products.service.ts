import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { sendResponse } from 'src/utils/response.helper';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export enum ProductField {
  NAME = 'name',
  CATEGORY = 'category',
  PRICE = 'price',
  QUANTITY = 'quantity',
  AVAILABILITY = 'availability',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

@Injectable()
export class ProductsService {
  private readonly allowedSortFields: string[] = [
    ProductField.NAME,
    ProductField.CATEGORY,
    ProductField.PRICE,
    ProductField.QUANTITY,
    ProductField.AVAILABILITY,
    ProductField.CREATED_AT,
    ProductField.UPDATED_AT,
  ];
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filter: Record<string, any> = {},
    searchQuery: string = '',
    searchField: string = '',
    minPrice: number = 0,
    maxPrice: number = Number.MAX_SAFE_INTEGER,
    availableOnly: boolean = true,
    minCreatedAt: Date = null,
    maxCreatedAt: Date = null,
    minUpdatedAt: Date = null,
    maxUpdatedAt: Date = null,
    sortField: string  = ProductField.CREATED_AT,
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    try {
      const skip = (page - 1) * limit;

      const query: FilterQuery<ProductDocument> = {
        ...filter,
      };

      // If a search field is specified, add it to the query
      if (searchField && searchQuery) {
        query[searchField] = { $regex: new RegExp(searchQuery, 'i') };
      } else if (searchQuery) {
        // If no specific field is specified, search in both name and category fields
        query.$or = [
          { name: { $regex: new RegExp(searchQuery, 'i') } },
          { category: { $regex: new RegExp(searchQuery, 'i') } },
        ];
      }

      // Add filtering by availability
      if (availableOnly !== undefined) {
        query.availability = availableOnly;
      }

      // Add filtering by price range
      query.price = { $gte: minPrice, $lte: maxPrice };

      // Add filtering by createdAt and updatedAt range
      if (minCreatedAt !== null || maxCreatedAt !== null) {
        query.createdAt = {};
        if (minCreatedAt !== null) {
          query.createdAt.$gte = minCreatedAt;
        }
        if (maxCreatedAt !== null) {
          query.createdAt.$lte = maxCreatedAt;
        }
      }

      if (minUpdatedAt !== null || maxUpdatedAt !== null) {
        query.updatedAt = {};
        if (minUpdatedAt !== null) {
          query.updatedAt.$gte = minUpdatedAt;
        }
        if (maxUpdatedAt !== null) {
          query.updatedAt.$lte = maxUpdatedAt;
        }
      }

      sortField = this.allowedSortFields.includes(sortField)
        ? sortField
        : ProductField.CREATED_AT;

      const products = await this.productModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder })
        .exec();
      const totalCount = await this.productModel
        .find(query)
        .countDocuments()
        .exec();

      if (!products) {
        return sendResponse(
          [],
          'No product Found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
          '',
          page,
          limit,
          totalCount,
        );
      }
      return sendResponse(
        products,
        'Products Retived successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
        '',
        page,
        limit,
        totalCount,
      );
    } catch (error) {
      return sendResponse(
        [],
        'No product Found',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
        '',
        page,
        limit,
        0,
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        return sendResponse(
          null,
          'Product not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }
      return sendResponse(
        product,
        'Product Retrived Successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.error('Error in findOne:', error);
      return sendResponse(
        null,
        'ERROR Retrieving Products',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        return sendResponse(
          null,
          'Product not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      // Update the product fields based on the DTO
      if (updateProductDto.name) {
        product.name = updateProductDto.name;
      }

      if (updateProductDto.category) {
        product.category = updateProductDto.category;
      }

      if (updateProductDto.price) {
        product.price = updateProductDto.price;
      }

      if (updateProductDto.availability !== undefined) {
        product.availability = updateProductDto.availability;
      }

      // Update any other fields as needed

      // Save the updated product
      const updatedProduct = await product.save();

      return sendResponse(
        updatedProduct,
        'Product Updated Successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      // Handle errors, log them, or throw a different exception
      console.error('Error in updateProductById:', error);
      return sendResponse(
        null,
        'Error Updating Product',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productModel.findById(id).exec();

      if (!product) {
        return sendResponse(
          null,
          'Product not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      // Set isDeleted to true
      product.isDeleted = true;

      // Save the updated product
      const updatedProduct = await product.save();

      return sendResponse(
        null,
        'Product Deleted',
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    } catch (error) {
      // Handle errors, log them, or throw a different exception
      console.error('Error in deleteProductById:', error);

      return sendResponse(
        null,
        'Error Deleting Product',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
