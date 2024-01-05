// response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'success' })
  status: any;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class ApiResponseArrayDto<T> {
  @ApiProperty({ example: 'success' })
  status: any;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message: string;

  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty()
  sort: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty()
  pagination: {
    page: number;
    pages: number;
    limit: number;
    totalCount: number;
  };
}

export class ApiResponseError {
  @ApiProperty({ example: 'error' })
  status: string;

  @ApiProperty({ example: 'An error occurred' })
  message: string;

  @ApiProperty({ example: 'Invalid input' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
