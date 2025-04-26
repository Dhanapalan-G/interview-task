import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Product, Order])],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}
