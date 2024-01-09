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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AUTH_GUARD_CONFIG } from 'src/guards/auth-guard';

@Controller('category')
@SetMetadata(AUTH_GUARD_CONFIG, {disabled: true}) 

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number ,
    @Query('limit') limit?: number ,
    @Query('filter') filter?: Record<string, any> ,
    @Query('sortField') sortField?: string ,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc' 
  ) {
    return this.categoryService.findAll(
      page,
      limit,
      filter,
      sortField as any,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
