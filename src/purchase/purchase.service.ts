import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase, PurchaseDocument } from './entities/purchase.entity';
import { FilterQuery, Model } from 'mongoose';
import { sendResponse } from 'src/utils/response.helper';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Product, ProductDocument } from 'src/products/entities/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    try {
      const product = await this.productModel
        .findById(createPurchaseDto.product)
        .exec();

      if (!product) {
        return sendResponse(
          null,
          'Product not found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      if (createPurchaseDto.quantity > product.quantity) {
        return sendResponse(
          null,
          'Insufficient quantity available for purchase',
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
        );
      }
      const totalPrice = createPurchaseDto.quantity * product.price;

      product.quantity -= createPurchaseDto.quantity;
      product.availability = product.quantity > 0;

      await product.save();

      const newPurchase = new this.purchaseModel({
        ...createPurchaseDto,
        totalPrice,
      });

      await newPurchase.save();

      return sendResponse(
        newPurchase,
        'Purchase created successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.log('Error creating purchase', error);
      return sendResponse(
        null,
        'Error creating purchase',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
    sortField: keyof Purchase = 'purchaseDate',
    sortOrder: 'asc' | 'desc' = 'desc',
    filter: Record<string, any> = {},
    minQuantity: number = 0,
    maxQuantity: number = Number.MAX_SAFE_INTEGER,
    minTotalPrice: number = 0,
    maxTotalPrice: number = Number.MAX_SAFE_INTEGER,
    minPurchaseDate: Date = null,
    maxPurchaseDate: Date = null,
    productName: string = '',
    userFirstName: string = '',
    userEmail: string = '',
    userLastName: string = '',
  ) {
    try {
      const skip = (page - 1) * limit;

      const query: FilterQuery<PurchaseDocument> = {
        ...filter,
        quantity: { $gte: minQuantity, $lte: maxQuantity },
        totalPrice: { $gte: minTotalPrice, $lte: maxTotalPrice },
      };
      if (
        minPurchaseDate !== null &&
        minPurchaseDate.toString() !== 'Invalid Date'
      ) {
        query.purchaseDate = { $gte: minPurchaseDate };
      }

      if (
        maxPurchaseDate !== null &&
        maxPurchaseDate.toString() !== 'Invalid Date'
      ) {
        query.purchaseDate = { ...query.purchaseDate, $lte: maxPurchaseDate };
      }

      if (productName) {
        query['product.name'] = { $regex: new RegExp(productName, 'i') };
      }

      if (userFirstName || userLastName || userEmail) {
        query.$or = [
          { 'user.firstName': { $regex: new RegExp(userFirstName, 'i') } },
          { 'user.lastName': { $regex: new RegExp(userLastName, 'i') } },
          { 'user.email': { $regex: new RegExp(userEmail, 'i') } },
        ];
      }

      const purchases = await this.purchaseModel
        .find(query)
        .sort({ [sortField]: sortOrder })
        .populate('user', '-password -salt')
        .populate('product')
        .skip(skip)
        .limit(limit)
        .exec();

      const totalCount = await this.purchaseModel.countDocuments(query).exec();

      if (!purchases) {
        return sendResponse(
          [],
          'No purchases found',
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
          sortField,
          page,
          limit,
          totalCount,
        );
      }

      return sendResponse(
        purchases,
        'Purchases retrieved successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
        sortField,
        page,
        limit,
        totalCount,
      );
    } catch (error) {
      console.log('Error retrieving purchases', error);
      return sendResponse(
        [],
        'Error retrieving purchases',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const purchase = await this.purchaseModel
        .findById(id)
        .populate('user', '-password -salt')
        .populate('product')
        .exec();

      if (!purchase) {
        return sendResponse(
          purchase,
          `Purchase with ID ${id} not found`,
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      return sendResponse(
        purchase,
        'Purchase retrieved successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.log('Error retrieving purchase', error);
      return sendResponse(
        null,
        'Error retrieving purchase',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    return `This action updates a #${id} purchase`;
  }

  async remove(id: string) {
    try {
      // Find the purchase by ID
      const existingPurchase = await this.purchaseModel.findById(id).exec();

      // Throw an exception if the purchase is not found
      if (!existingPurchase) {
        return sendResponse(
          existingPurchase,
          `Purchase with ID ${id} not found`,
          ReasonPhrases.NOT_FOUND,
          StatusCodes.NOT_FOUND,
        );
      }

      // Set isDeleted to true and save the document
      existingPurchase.isDeleted = true;
      await existingPurchase.save();

      return sendResponse(
        existingPurchase,
        'Purchase removed successfully',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.log('Error removing purchase', error);
      return sendResponse(
        null,
        'Error removing purchase',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }






  async getStats(start:Date = new Date('2020-01-01'), end:Date = new Date() , interval : string){
    try {
      const data = {
        trand: await this.getPurchaseTrends(start , end, interval),
        top_selling:await this.getTopSellingProducts(start , end),
        totla_purchases: await this.getTotalPurchasesPerProduct(start , end)
   
       }
      return sendResponse(
        {...data},
        'Starts retrived',
        ReasonPhrases.OK,
        StatusCodes.OK,
      );
    } catch (error) {
      console.log('Error retriving stats'+error);
      
      return sendResponse(
        null , 
        'Error retriving stats',
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }



    

  }
async getPurchaseTrends(start: Date, end: Date, interval = 'month') {

  return this.purchaseModel.aggregate([
    {
      $match: {
        purchaseDate: {
          $gte: start, 
          $lte: end
        }
      }
    },
    {
      $group: {
        _id: { 
          year: { $year: "$purchaseDate" },
          month: { $month: "$purchaseDate" }, 
        },
        totalSales: { $sum: "$totalPrice" },
        totalItems: { $sum: "$quantity"},  
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $unwind: "$product"
    } ,
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1  
      }
    }
  ]);

}
async getTopSellingProducts(start: Date, end: Date, limit = 5) {

  return this.purchaseModel.aggregate([
    {
      $match: {
        purchaseDate: {
          $gte: start,  
          $lte: end
        }
      }
    },
    {
      $group: {
        _id: "$product", 
        totalSales: { $sum: "$totalPrice" }  
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $unwind: "$product"
    } ,
    { 
      $sort: { totalSales: -1 }  
    },
    {
      $limit: limit
    }
  ]);

}

async getTotalPurchasesPerProduct(start: Date, end: Date) {

  return this.purchaseModel.aggregate([
    {
      $match: {
        purchaseDate: {
          $gte: start,  
          $lte: end
        }  
      }
    },
    {
      $group: {
        _id: "$product",
        totalQuantity: { $sum: "$quantity" },
        totalPrice: { $sum: "$totalPrice" }  
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $unwind: "$product"
    } 
  ]);

}



}
