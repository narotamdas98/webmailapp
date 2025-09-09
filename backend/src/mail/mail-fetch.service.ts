import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailFetchService {
  constructor(private prisma: PrismaService) {}

  async fetchInboxFromIMAP(userId: number, plainPassword?: string) {
    // Get user information
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, dovecot_password: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // For MVP, we'll use the plain password if provided, otherwise use the stored hash
    // In production, you'd want to handle this more securely
    const password = plainPassword || user.dovecot_password;

    if (!password) {
      throw new Error('No password available for IMAP authentication');
    }

    // Configure IMAP connection to Dovecot
    const client = new ImapFlow({
      host: process.env.IMAP_HOST || 'dovecot',
      port: parseInt(process.env.IMAP_PORT || '143'),
      secure: false, // true for 993, false for other ports
      auth: {
        user: user.email,
        pass: password
      }
    });

    try {
      // Connect to IMAP server
      await client.connect();
      console.log('Connected to IMAP server');

      // Select INBOX
      const lock = await client.getMailboxLock('INBOX');
      const mailbox = await client.mailboxOpen('INBOX');

      // Fetch recent messages (last 10)
      const messages = [];
      const messageGenerator = client.fetch(
        { seq: '1:*' },
        { envelope: true, uid: true, flags: true, bodyStructure: true }
      );

      let count = 0;
      for await (const message of messageGenerator) {
        if (count >= 10) break; // Limit to 10 messages for MVP
        
        messages.push({
          uid: message.uid,
          envelope: message.envelope,
          flags: message.flags,
          bodyStructure: message.bodyStructure
        });
        count++;
      }

      lock.release();
      await client.logout();

      return {
        message: 'Inbox fetched successfully',
        messages: messages,
        total: mailbox.exists
      };

    } catch (error) {
      console.error('Error fetching from IMAP: ', error);
      throw new Error('Failed to fetch emails from IMAP server');
    }
  }

  async fetchMessageContent(userId: number, messageUid: number, plainPassword?: string) {
    // Get user information
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, dovecot_password: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const password = plainPassword || user.dovecot_password;

    if (!password) {
      throw new Error('No password available for IMAP authentication');
    }

    // Configure IMAP connection to Dovecot
    const client = new ImapFlow({
      host: process.env.IMAP_HOST || 'dovecot',
      port: parseInt(process.env.IMAP_PORT || '143'),
      secure: false,
      auth: {
        user: user.email,
        pass: password
      }
    });

    try {
      await client.connect();
      const lock = await client.getMailboxLock('INBOX');

      // Fetch specific message by UID
      const message = await client.download('INBOX', messageUid.toString(), { uid: true });
      
      let content = '';
      if (typeof message === 'object' && typeof message.content === 'object' && typeof message.content.read === 'function') {
        // message.content is a Readable stream
        for await (const chunk of message.content) {
          content += chunk.toString();
        }
      } else {
        throw new Error('Unexpected message object returned from IMAP client');
      }

      lock.release();
      await client.logout();

      return {
        message: 'Message content fetched successfully',
        content: content
      };

    } catch (error) {
      console.error('Error fetching message content: ', error);
      throw new Error('Failed to fetch message content from IMAP server');
    }
  }
}
