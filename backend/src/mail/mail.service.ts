import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    // Configure nodemailer transporter for Postfix
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'postfix',
      port: parseInt(process.env.SMTP_PORT || '25'),
      secure: false, // true for 465, false for other ports
      tls: {
        rejectUnauthorized: false
      }
    });
  }

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

  async sendMailViaSMTP(fromUserId: number, toEmail: string, subject: string, body: string) {
    if (!toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
      throw new Error('Valid recipient email is required')
    }
    if (!subject || subject.trim().length === 0) {
      throw new Error('Subject is required')
    }
    if (!body || body.trim().length === 0) {
      throw new Error('Body is required')
    }

    // Get sender information
    const sender = await this.prisma.user.findUnique({ where: { id: fromUserId } })
    if (!sender) {
      throw new Error('Sender not found')
    }

    // Send email via SMTP
    const mailOptions = {
      from: sender.email,
      to: toEmail,
      subject: subject,
      text: body,
      html: `<p>${body}</p>`
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
      
      // Also save to database
      const recipient = await this.prisma.user.findUnique({ where: { email: toEmail } })
      if (recipient) {
        await this.prisma.mail.create({
          data: {
            subject,
            body,
            fromUserId,
            toUserId: recipient.id,
          },
        });
      }
      
      return { message: 'Email sent successfully', messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new Error('Failed to send email via SMTP');
    }
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


