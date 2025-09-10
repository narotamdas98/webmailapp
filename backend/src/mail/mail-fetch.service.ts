import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailFetchService {
  constructor(private prisma: PrismaService) {}

  async fetchInboxFromIMAP(userId: number, plainPassword?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, dovecot_password: true }
    });
    if (!user) throw new Error('User not found');
  
    const password = plainPassword || user.dovecot_password;
    if (!password) throw new Error('No password available for IMAP authentication');
  
    const client = new ImapFlow({
      host: process.env.IMAP_HOST || 'dovecot',
      port: parseInt(process.env.IMAP_PORT || '143'),
      secure: false,
      auth: { user: user.email, pass: "123456" }
    });
  
    try {
      await client.connect();
      console.log('Connected to IMAP server');
  
      const lock = await client.getMailboxLock('INBOX');
      const mailbox = await client.mailboxOpen('INBOX');
  
      const messages = [];
      const messageGenerator = client.fetch(
        { seq: '1:*' },
        { envelope: true, uid: true, flags: true, bodyParts: ['1', '2'] } 
        // '1' = text/plain, '2' = text/html (depends on your emails)
      );
  
      let count = 0;
      for await (const msg of messageGenerator) {
        if (count >= 10) break;
  
        let plainText = '';
        let htmlText = '';
  
        
        
        if (msg.bodyParts?.get('1')) {
          plainText = Buffer.from(msg.bodyParts.get('1')!).toString('utf-8');
        }
        if (msg.bodyParts?.get('2')) {
          htmlText = Buffer.from(msg.bodyParts.get('2')!).toString('utf-8');
        }
  
        messages.push({
          uid: msg.uid,
          subject: msg.envelope?.subject || '(No subject)',
          fromUser: msg.envelope?.from?.[0] || null,
          to: msg.envelope?.to || null,
          date: msg.envelope?.date,
          flags: msg.flags,
          body: {
            text: msg.bodyParts?.get('1') ? plainText : '',
            html: msg.bodyParts?.get('2') ? htmlText : ''
          }
        });
  
        count++;
      }
  
      lock.release();
      await client.logout();
  
      return {
        message: 'Inbox fetched successfully',
        messages,
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
