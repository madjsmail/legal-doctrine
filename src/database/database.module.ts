import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
} from 'src/category/entities/category.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';
import { Purchase, PurchaseSchema } from 'src/purchase/entities/purchase.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';

@Module({
  
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Purchase.name,
        schema: PurchaseSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
