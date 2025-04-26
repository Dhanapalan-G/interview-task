import {
  Controller,
  Post,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('load')
  async loadCsv() {
    await this.salesService.loadCsv('sales.csv'); // Assume you upload/copy the CSV locally
    return { message: 'CSV data loaded successfully' };
  }

  @Get('revenue')
  async getRevenue(@Query('start') start: string, @Query('end') end: string) {
    const revenue = await this.salesService.calculateTotalRevenue(start, end);
    return { totalRevenue: revenue };
  }
  @Get('revenue-by-product')
  async getRevenueByProduct(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.salesService.revenueByProduct(start, end);
  }

  @Get('revenue-by-category')
  async getRevenueByCategory(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.salesService.revenueByCategory(start, end);
  }

  @Get('revenue-by-region')
  async getRevenueByRegion(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return await this.salesService.revenueByRegion(start, end);
  }
  @Get('revenue-trends')
  async getRevenueTrends(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('interval') interval: 'monthly' | 'quarterly' | 'yearly',
  ) {
    return await this.salesService.revenueTrends(start, end, interval);
  }
  @Post('upload-csv')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // JWT + Role Guard
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `sales.csv`; // Always replace the old one
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadCsv(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    await this.salesService.loadCsv(`uploads/${file.filename}`);
    return { message: 'CSV uploaded and data refreshed successfully' };
  }
}
