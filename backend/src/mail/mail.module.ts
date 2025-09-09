import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import { MailFetchService } from './mail-fetch.service';
import { MailController } from './mail.controller';

@Module({
  providers: [PrismaService, MailService, MailFetchService],
  controllers: [MailController],
})
export class MailModule {}


