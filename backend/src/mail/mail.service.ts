import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(private prisma: PrismaService) {}

  async sendMail(fromUserId: number, toUserId: number, subject: string, body: string) {
    if (!subject || subject.trim().length === 0) {
      throw new Error('Subject is required')
    }
    if (!body || body.trim().length === 0) {
      throw new Error('Body is required')
    }
    if (fromUserId === toUserId) {
      throw new Error('Cannot send mail to yourself')
    }
    const toUser = await this.prisma.user.findUnique({ where: { id: toUserId } })
    if (!toUser) {
      throw new Error('Recipient not found')
    }
    return this.prisma.mail.create({
      data: {
        subject,
        body,
        fromUserId,
        toUserId,
      },
    });
  }

  async sendMailByEmail(fromUserId: number, toEmail: string, subject: string, body: string) {
    if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      throw new Error('Valid recipient email is required')
    }
    const recipient = await this.prisma.user.findUnique({ where: { email: toEmail } })
    if (!recipient) {
      throw new Error('Recipient not found')
    }
    return this.sendMail(fromUserId, recipient.id, subject, body)
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


