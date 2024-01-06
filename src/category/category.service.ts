import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { sendResponse } from 'src/utils/response.helper';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Category, CategoryDocument } from './entities/category.entity';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const createdCategory = new this.categoryModel(createCategoryDto);
      const savedCategory = await createdCategory.save();
      return sendResponse(
        createdCategory,
        'category Created Successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.log('error in create category', error);

      return sendResponse(
        null,
        'Error creating category',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filter: Record<string, any> = {},
    sortField: keyof Category = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const query: FilterQuery<CategoryDocument> = {
        ...filter,
      };
      const validSortField = Object.keys(new Category()).includes(
        sortField as string,
      )
        ? (sortField as string)
        : 'createdAt';
      const categories = await this.categoryModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ [validSortField]: sortOrder })
        .exec();

      const totalCount = await this.categoryModel.countDocuments(query).exec();

      if (!categories || categories.length === 0) {
        return sendResponse(
          [],
          'No categories found',
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR,
          validSortField,
          page,
          limit,
          totalCount,
        );
      }

      return sendResponse(
        categories,
        'Categories retrieved successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
        validSortField,
        page,
        limit,
        totalCount,
      );
    } catch (error) {
      console.log('error in find all category', error);

      return sendResponse(
        [],
        'Categories retrieved successfully',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        return sendResponse(
          null,
          'category not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }
      return sendResponse(
        category,
        'category Retrived Successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.error('Error in findOne:', error);
      return sendResponse(
        null,
        'ERROR Retrieving category',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        return sendResponse(
          null,
          'category not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      // Update the category fields based on the DTO
      if (updateCategoryDto.name) {
        category.name = updateCategoryDto.name;
      }

      if (updateCategoryDto.description) {
        category.description = updateCategoryDto.description;
      }

      // Save the updated category
      const updatedcategory = await category.save();

      return sendResponse(
        updatedcategory,
        'category Updated Successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      // Handle errors, log them, or throw a different exception
      console.error('Error in updatecategoryById:', error);
      return sendResponse(
        null,
        'Error Updating category',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        return sendResponse(
          null,
          'category not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      // Set isDeleted to true
      category.isDeleted = true;

      // Save the updated category
      const updatedcategory = await category.save();

      return sendResponse(
        null,
        'category Deleted',
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
      );
    } catch (error) {
      // Handle errors, log them, or throw a different exception
      console.error('Error in delete category ById:', error);

      return sendResponse(
        null,
        'Error Deleting category',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
