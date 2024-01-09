import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AUTH_GUARD_CONFIG, AuthGuardConfig } from 'src/guards/auth-guard';

@Controller('products')
@SetMetadata(AUTH_GUARD_CONFIG, {disabled: true}) 

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('filter') filter?: string,
    @Query('search') search?: string,
    @Query('searchField') searchField?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('availableOnly') availableOnly?: boolean,
    @Query('minCreatedAt') minCreatedAt?: string,
    @Query('maxCreatedAt') maxCreatedAt?: string,
    @Query('minUpdatedAt') minUpdatedAt?: string,
    @Query('maxUpdatedAt') maxUpdatedAt?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    let parsedFilter = {};
    try {
      parsedFilter = filter ? JSON.parse(JSON.stringify(filter)) : {};
    } catch (error) {
      console.error('Error parsing filter:', error);
    }
    const convertToDate = (dateString: string | undefined) =>
      dateString ? new Date(dateString) : null;
    return this.productsService.findAll(
      page,
      limit,
      parsedFilter,
      search,
      searchField,
      minPrice,
      maxPrice,
      availableOnly,
      convertToDate(minCreatedAt),
      convertToDate(maxCreatedAt),
      convertToDate(minUpdatedAt),
      convertToDate(maxUpdatedAt),
      sortField,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
