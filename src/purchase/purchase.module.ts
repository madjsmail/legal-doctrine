import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
