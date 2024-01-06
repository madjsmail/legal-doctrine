import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [UserModule, AuthModule, ProductsModule, CategoryModule, PurchaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
