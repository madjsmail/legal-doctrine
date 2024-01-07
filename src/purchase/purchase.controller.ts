import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { query } from 'express';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortField') sortField: keyof Purchase = 'purchaseDate',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('filter') filter: string = '',
    @Query('minQuantity') minQuantity: number = 0,
    @Query('maxQuantity') maxQuantity: number = Number.MAX_SAFE_INTEGER,
    @Query('minTotalPrice') minTotalPrice: number = 0,
    @Query('maxTotalPrice') maxTotalPrice: number = Number.MAX_SAFE_INTEGER,
    @Query('minPurchaseDate') minPurchaseDate: string = '',
    @Query('maxPurchaseDate') maxPurchaseDate: string = '',
    @Query('productName') productName: string = '',
    @Query('userFirstName') userFirstName: string = '',
    @Query('userEmail') userEmail: string = '',
    @Query('userLastName') userLastName: string = '',
  ) {
    let parsedFilter = {};
    try {
      parsedFilter = filter ? JSON.parse(JSON.stringify(filter)) : {};
    } catch (error) {
      console.error('Error parsing filter:', error);
    }
    return this.purchaseService.findAll(
      page,
      limit,
      sortField,
      sortOrder,
      parsedFilter,
      minQuantity,
      maxQuantity,
      minTotalPrice,
      maxTotalPrice,
      new Date(minPurchaseDate),
      new Date(maxPurchaseDate),
      productName,
      userFirstName,
      userEmail,
      userLastName,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
  @Get('/product/stats')
  getStats(@Query('start') start: Date, @Query('end') end: Date, @Query('interval')  interval : 'month') {
    return this.purchaseService.getStats(start,end,interval);
  }
}
