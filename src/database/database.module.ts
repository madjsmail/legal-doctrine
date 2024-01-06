import { Module } from '@nestjs/common';
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
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', {
      dbName: 'legal-doctrine',
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
