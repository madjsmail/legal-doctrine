import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsBoolean, IsDate } from 'class-validator';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
export type userDocument = User & Document;

enum UserRole {
  ADMIN = 'admin',
  TOP_UP = 'user',
  MERCHANT = 'client',
}
@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @IsString()
  @Prop({ required: true })
  firstName: string;

  @IsString()
  @Prop({ required: true })
  lastName: string;

  @IsString()
  @Prop({ unique: true, required: true })
  email: string;

  // @IsString()
  // @Prop({ required: true })
  // emailValidationCode: string;

  @IsBoolean()
  @Prop({ default: false })
  isValidEmail: boolean;

  @IsString()
  @Prop({ unique: true, required: true })
  phoneNumber: string;

  // @IsString()
  // @Prop({ required: true })
  // phoneValidationCode: string;

  @IsBoolean()
  @Prop({ default: false })
  isValidPhone: boolean;

  @IsString()
  @Prop({ required: true, hidden: true })
  password: string;

  @IsString()
  @Prop({ required: true, hidden: true })
  salt: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.MERCHANT })
  role: string;

  @IsDate()
  @Prop()
  createdAt: Date;

  @IsDate()
  @Prop()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
