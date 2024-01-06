import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsDate, IsBoolean } from 'class-validator';
import * as mongoose from 'mongoose';

export type PurchaseDocument = Purchase & mongoose.Document;
@Schema()
export class Purchase {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: (v: any) => mongoose.Types.ObjectId.isValid(v),
      message: 'user must be a valid ObjectId',
    },
  })
  user: mongoose.Schema.Types.ObjectId;


  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    validate: {
      validator: (v: any) => mongoose.Types.ObjectId.isValid(v),
      message: 'Product must be a valid ObjectId',
    },
  })
  product: mongoose.Schema.Types.ObjectId;

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
