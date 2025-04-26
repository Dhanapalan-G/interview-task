import { Module } from '@nestjs/common';
import { CustomerAuthService } from '../auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer';
import { CustomerAuthController } from '../auth/auth.controller';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerAuthController],
  providers: [CustomerAuthService, JwtService],
})
export class CustomerAuthModule {}
