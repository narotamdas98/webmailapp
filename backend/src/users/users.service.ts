import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt  from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async signup(email: string, plainPassword: string, name: string) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    return user;
  }

  async verifyCredentials(email: string, plainPassword: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return false;
    return bcrypt.compare(plainPassword, user.password);
  }
}

