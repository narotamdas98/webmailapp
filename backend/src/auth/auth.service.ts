import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';   // ✅ drop-in replacement

//  import sha512crypt from 'sha512-crypt-ts';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { sha512  } from 'sha512-crypt-ts';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Hash password with bcrypt for app authentication
    const hashedPassword = await bcrypt.hash(password, 10);
    // Use the sha512 property from sha512crypt for Dovecot compatibility
    // sha512crypt.sha512.setBase64Padding(false);

    // // Generate SHA512-CRYPT hash for Dovecot
    // const salt = sha512crypt.sha512.();
    // const dovecotPassword = sha512crypt.sha512(password, salt);

    // const dovecotPassword = sha512crypt.(password, { rounds: 5000 });
    const salt = 'yourSalt'; // choose from [./0-9A-Za-z], up to 16 chars
    const dovecotPassword = sha512.crypt(password, salt);
    // const dovecotPassword = sha512.hash(password, { rounds: 5000 });



    // Create user
    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        dovecot_password: dovecotPassword,
      },
    });

    return { message: 'User created successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
