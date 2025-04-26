import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyRefreshJob() {
    console.log('⏰ Daily Refresh Started...');
    try {
      await this.loadCsv('sales.csv'); // you can automate the file path
      console.log('✅ Daily Refresh Completed');
    } catch (error) {
      console.error('❌ Daily Refresh Failed', error);
    }
  }
  async loadCsv(filePath: string): Promise<void> {
    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const record of stream) {
      let customer = await this.customerRepo.findOne({
        where: { customerId: record['Customer ID'] },
      });
      if (!customer) {
        customer = this.customerRepo.create({
          customerId: record['Customer ID'],
          customerName: record['Customer Name'],
          customerEmail: record['Customer Email'],
          customerAddress: record['Customer Address'],
        });
        await this.customerRepo.save(customer);
      }

      let product = await this.productRepo.findOne({
        where: { productId: record['Product ID'] },
      });
      if (!product) {
        product = this.productRepo.create({
          productId: record['Product ID'],
          productName: record['Product Name'],
          category: record['Category'],
        });
        await this.productRepo.save(product);
      }

      const order = this.orderRepo.create({
        orderId: record['Order ID'],
        product,
        customer,
        region: record['Region'],
        dateOfSale: new Date(record['Date of Sale']),
        quantitySold: parseInt(record['Quantity Sold']),
        unitPrice: parseFloat(record['Unit Price']),
        discount: parseFloat(record['Discount']),
        shippingCost: parseFloat(record['Shipping Cost']),
        paymentMethod: record['Payment Method'],
      });

      await this.orderRepo.save(order);
    }
  }

  async calculateTotalRevenue(
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.dateOfSale BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getMany();

    let total = 0;
    for (const order of orders) {
      const revenue =
        order.unitPrice * order.quantitySold * (1 - order.discount);
      total += revenue;
    }
    return total;
  }
  async revenueByProduct(startDate: string, endDate: string) {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.product', 'product')
      .select('product.productName', 'productName')
      .addSelect(
        'SUM((order.unitPrice * order.quantitySold) * (1 - order.discount))',
        'revenue',
      )
      .where('order.dateOfSale BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .groupBy('product.productName')
      .getRawMany();
    return result;
  }

  async revenueByCategory(startDate: string, endDate: string) {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin('order.product', 'product')
      .select('product.category', 'category')
      .addSelect(
        'SUM((order.unitPrice * order.quantitySold) * (1 - order.discount))',
        'revenue',
      )
      .where('order.dateOfSale BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .groupBy('product.category')
      .getRawMany();
    return result;
  }

  async revenueByRegion(startDate: string, endDate: string) {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.region', 'region')
      .addSelect(
        'SUM((order.unitPrice * order.quantitySold) * (1 - order.discount))',
        'revenue',
      )
      .where('order.dateOfSale BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .groupBy('order.region')
      .getRawMany();
    return result;
  }
  async revenueTrends(
    startDate: string,
    endDate: string,
    interval: 'monthly' | 'quarterly' | 'yearly',
  ) {
    let dateFormat;
    switch (interval) {
      case 'monthly':
        dateFormat = "TO_CHAR(order.dateOfSale, 'YYYY-MM')";
        break;
      case 'quarterly':
        dateFormat =
          "CONCAT('Q', EXTRACT(QUARTER FROM order.dateOfSale), '-', EXTRACT(YEAR FROM order.dateOfSale))";
        break;
      case 'yearly':
        dateFormat = "TO_CHAR(order.dateOfSale, 'YYYY')";
        break;
      default:
        throw new Error('Invalid interval type');
    }

    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select(`${dateFormat}`, 'period')
      .addSelect(
        'SUM((order.unitPrice * order.quantitySold) * (1 - order.discount))',
        'revenue',
      )
      .where('order.dateOfSale BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return result;
  }
}
