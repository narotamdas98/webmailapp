import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { MailService } from './mail.service';

class SendMailDto {
  subject!: string;
  body!: string;
  toUserId!: number;
}

@Controller('mail')
@UseGuards(AuthGuard('jwt'))
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('send')
  async send(@GetUser() user: any, @Body() dto: SendMailDto) {
    return this.mailService.sendMail(user.id, dto.toUserId, dto.subject, dto.body);
  }

  @Get('inbox')
  async inbox(@GetUser() user: any) {
    return this.mailService.getInbox(user.id);
  }

  @Get('sent')
  async sent(@GetUser() user: any) {
    return this.mailService.getSent(user.id);
  }
}


