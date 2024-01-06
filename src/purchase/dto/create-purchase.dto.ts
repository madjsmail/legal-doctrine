import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty()
  @IsMongoId()
  user: string;
  @ApiProperty()
  @IsMongoId()
  product: string;
  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  purchaseDate?: Date;
}
