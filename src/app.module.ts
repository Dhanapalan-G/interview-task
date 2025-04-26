import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { SalesModule } from './sales/sales.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { LoggingMiddleware } from './middleware/logging';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '25121999',
      database: 'salesdb',
      entities: [Product, Customer, Order, User],
      synchronize: true, // ❗ only in dev
    }),
    ScheduleModule.forRoot(),
    SalesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      // .exclude({ path: 'metrics', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
