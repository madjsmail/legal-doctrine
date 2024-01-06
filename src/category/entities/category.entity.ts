import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean } from 'class-validator';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @IsBoolean()
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
