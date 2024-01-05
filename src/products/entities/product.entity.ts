import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';
import * as mongoose from 'mongoose';

export type ProductDocument = Product & mongoose.Document;

@Schema()
export class Product {
  _id: mongoose.Schema.Types.ObjectId;

  @IsString()
  @Prop({ required: true, unique: true })
  name: string;

  @IsString()
  @Prop({ required: true })
  category: string;

  @IsNumber()
  @Prop({ required: true })
  price: number;

  @IsNumber()
  @Prop({ required: true })
  quantity: number;

  @IsBoolean()
  @Prop({ default: true })
  availability: boolean;

  @IsBoolean()
  @Prop({ default: false })
  isDeleted: boolean;

  @IsDate()
  @Prop()
  createdAt: Date;

  @IsDate()
  @Prop()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
