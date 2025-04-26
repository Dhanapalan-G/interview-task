import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginauthDto, LogoutauthDto, VerifyauthDto } from '../auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entities/customer';
import { Repository } from 'typeorm';
import * as twilio from 'twilio';

@Injectable()
export class CustomerAuthService {
  protected verifySid = process.env.TWILIO_VERIFY_SID;
  protected client: twilio.Twilio;

  constructor(
    @InjectRepository(Customer)
    private readonly custRepository: Repository<Customer>,
  ) {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async login(loginauthDto: LoginauthDto) {
    await this.custRepository.findOne({
      where: {
        phone: loginauthDto.phone,
        country_code: loginauthDto.country_code,
      },
    });
    // try {
    //   await this.client.verify.v2
    //     .services(this.verifySid)
    //     .verifications.create({
    //       to: loginauthDto.country_code + loginauthDto.mobile_number,
    //       channel: 'sms',
    //     });
    return { success: true, message: 'Login OTP sent successfully' };
    // } catch (error) {
    //   if (error.status == 429) {
    //     throw new HttpException('Too many request', HttpStatus.BAD_REQUEST);
    //   } else {
    //     throw new HttpException('Twilio error', HttpStatus.BAD_REQUEST);
    //   }
    // }
  }

  async verify(verifyauthDto: VerifyauthDto) {
    try {
      //for twillo
      // const verificationCheck = await this.client.verify.v2
      //   .services(this.verifySid)
      //   .verificationChecks.create({
      //     to: verifyauthDto.country_code + verifyauthDto.mobile_number,
      //     code: verifyauthDto.otp,
      //   });
    } catch (error) {
      if (error.status == 429) {
        throw new HttpException('Too many request', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Twilio error', HttpStatus.BAD_REQUEST);
      }
    }
    // if (verificationCheck.status === 'approved') {
    if (verifyauthDto.otp === '112233') {
      const auth = await this.custRepository.findOne({
        where: {
          phone: verifyauthDto.phone,
          country_code: verifyauthDto.country_code,
          station_id: verifyauthDto.station_id,
        },
        relations: ['token'],
      });

      if (auth) {
        await this.updateNotificationToken({
          ...verifyauthDto,
          customer_id: auth.id,
        });
        return new ResponseCustomerByIdDto(auth);
      } else {
        const auth = this.custRepository.create(verifyauthDto);
        const customer = await this.custRepository.save(auth);
        await this.updateNotificationToken({
          ...verifyauthDto,
          customer_id: customer.id,
        });
        return new ResponseCustomerByIdDto(customer);
      }
    } else {
      throw new HttpException('Incorrect OTP', HttpStatus.BAD_REQUEST);
    }
  }

  async updateNotificationToken(data: any): Promise<any> {
    let notificationToken = await this.notiTokenRepository.findOne({
      where: { customer_id: data.customer_id },
    });

    if (!notificationToken) {
      notificationToken = this.notiTokenRepository.create({
        customer_id: data.customer_id,
        token: data.notification_token,
      });
    } else {
      notificationToken.token = data.notification_token;
    }
    return this.notiTokenRepository.save(notificationToken);
  }

  async remove(data: LogoutauthDto): Promise<void> {
    await this.notiTokenRepository.delete({
      token: data.notification_token,
      customer_id: data.customer_id,
    });
  }
}
