import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { MailService } from './mail.service';
import { MailFetchService } from './mail-fetch.service';

class SendMailDto {
  subject!: string;
  body!: string;
  toEmail!: string;
}

@Controller('mail')
@UseGuards(AuthGuard('jwt'))
export class MailController {
  constructor(
    private mailService: MailService,
    private mailFetchService: MailFetchService
  ) {}

  @Post('send')
  async send(@GetUser() user: any, @Body() dto: SendMailDto) {
    return this.mailService.sendMailByEmail(user.id, dto.toEmail, dto.subject, dto.body);
  }

  @Post('send-smtp')
  async sendSmtp(@GetUser() user: any, @Body() dto: SendMailDto) {
    return this.mailService.sendMailViaSMTP(user.id, dto.toEmail, dto.subject, dto.body);
  }

  @Get('inbox')
  async inbox(@GetUser() user: any) {
    return this.mailService.getInbox(user.id);
  }

  @Get('sent')
  async sent(@GetUser() user: any) {
    return this.mailService.getSent(user.id);
  }

  @Get('fetch-inbox')
  async fetchInbox(@GetUser() user: any, @Query('mailPassword') mailPassword?: string) {
    return this.mailFetchService.fetchInboxFromIMAP(user.id, mailPassword);
  }

  @Get('fetch-message')
  async fetchMessage(@GetUser() user: any, @Query('uid') uid: string, @Query('mailPassword') mailPassword?: string) {
    return this.mailFetchService.fetchMessageContent(user.id, parseInt(uid), mailPassword);
  }
}


