import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginauthDto {
  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiProperty({ example: '+91' })
  @IsNotEmpty({ message: 'Country code is required' })
  country_code: string;
}

export class VerifyauthDto {
  // @ApiProperty({ example: 'sta_016XDAHQPS6681JKNL7AEIMT5U4' })
  // @IsNotEmpty({ message: 'Station id is required' })
  station_id: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty({ message: 'Mobile number is required' })
  phone: string;

  @ApiProperty({ example: '+91' })
  @IsNotEmpty({ message: 'Country code is required' })
  country_code: string;

  @ApiProperty({ example: '112233' })
  @IsNotEmpty({ message: 'Otp code is required' })
  otp: string;

  @ApiProperty({ example: 'AaBbCcDd', required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'Notification token is required' })
  notification_token?: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refresh_token: string;
}

export class LogoutauthDto {
  customer_id: string;

  @ApiProperty({ required: false })
  @IsNotEmpty({ message: 'Notification token is required' })
  notification_token: string;
}
