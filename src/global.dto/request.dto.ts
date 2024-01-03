import { ApiProperty } from '@nestjs/swagger';

export class PaginationSortDto {
  @ApiProperty({ required: false, default: 1, description: 'search query' })
  //   @ApiQuery({ name: 'page', type: Number, required: false, default: 1 })
  q: string | number | any;
  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  //   @ApiQuery({ name: 'page', type: Number, required: false, default: 1 })
  page: number;

  @ApiProperty({ required: false, default: 10, description: 'Items per page' })
  //   @ApiQuery({ name: 'limit', type: Number, required: false, default: 10 })
  limit: number;

  @ApiProperty({
    required: false,
    description: 'Sort field and order (e.g., name)',
  })
  //   @ApiQuery({ name: 'sort', required: false })
  sort: string;
  @ApiProperty({
    required: false,
    description: 'Sort Direction (e.g.,asc)',
    default: -1,
  })
  //   @ApiQuery({ name: 'sort', required: false })
  sortDirection: number;
}
