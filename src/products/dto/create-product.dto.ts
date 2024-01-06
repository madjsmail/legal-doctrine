import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  readonly category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  readonly availability: boolean;
}
