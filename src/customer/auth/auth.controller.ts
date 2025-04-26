import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerAuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { ApiTags } from '@nestjs/swagger'; // Import ApiTags decorator
import { LoginauthDto, RefreshTokenDto, VerifyauthDto } from './auth.dto';

@ApiTags('Customer-app - Auth { Station List, Login, Verify, Refresh, Logout }')
@Controller('customer')
export class CustomerAuthController {
  constructor(
    private readonly authService: CustomerAuthService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}
  // CUSTOMER LOGIN
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginauthDto: LoginauthDto) {
    const response = await this.authService.login(loginauthDto);
    return { ...response, statusCode: HttpStatus.OK };
  }

  // CUSTOMER VERIFY
  @Post('verify')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async verify(@Body() verifyauthDto: VerifyauthDto) {
    const customer = await this.authService.verify({
      ...verifyauthDto,
      station_id: 'sta_016XDAHQPS6681JKNL7AEIMT5U4',
    });
    if (!customer) {
      return {
        message: 'Invalid credentials',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
    const access_token = this.jwtService.sign(
      { userId: customer.customer_id, stationId: customer.station_id },

      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.ACCESS_EXPIRE_TIME, // Set the expiration directly
      },
    );
    const refresh_token = this.jwtService.sign(
      { userId: customer.customer_id, stationId: customer.station_id },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.REFRESH_EXPIRE_TIME, // Set the expiration directly
      },
    );
    return { customer, access_token, refresh_token, statusCode: HttpStatus.OK };
  }

  // CUSTOMER REFRESH
  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refresh(@Body() refreshData: RefreshTokenDto) {
    try {
      const decoded = await this.jwtService.verify(refreshData.refresh_token, {
        secret: process.env.JWT_SECRET,
      });
      if (decoded) {
        const access_token = this.jwtService.sign(
          { userId: decoded.userId, stationId: decoded.station_id },

          {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.ACCESS_EXPIRE_TIME, // Set the expiration directly
          },
        );
        // res.status(HttpStatus.OK).json({ message: 'Success' });
        return { access_token, statusCode: HttpStatus.OK };
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }
}
