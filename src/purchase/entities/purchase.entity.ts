import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  IsNumber, IsDate, IsBoolean } from 'class-validator';
import * as mongoose from 'mongoose';

export type PurchaseDocument = Purchase & mongoose.Document;
@Schema()
export class Purchase {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product', required: true })
  product: mongoose.Types.ObjectId;

  @IsNumber()
  @Prop({ required: true })
  quantity: number;

  @IsNumber()
  @Prop({ required: true })
  totalPrice: number;
  @IsBoolean()
  @Prop({ default: false })
  isDeleted: boolean;

  @IsDate()
  @Prop({ default: Date.now })
  purchaseDate: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
