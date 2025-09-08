import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(private prisma: PrismaService) {}

  async sendMail(fromUserId: number, toUserId: number, subject: string, body: string) {
    return this.prisma.mail.create({
      data: {
        subject,
        body,
        fromUserId,
        toUserId,
      },
    });
  }

  async getInbox(userId: number) {
    return this.prisma.mail.findMany({
      where: { toUserId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: { select: { id: true, email: true, name: true } },
        toUser: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async getSent(userId: number) {
    return this.prisma.mail.findMany({
      where: { fromUserId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: { select: { id: true, email: true, name: true } },
        toUser: { select: { id: true, email: true, name: true } },
      },
    });
  }
}


