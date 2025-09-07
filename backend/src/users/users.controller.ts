import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

class SignupDto {
  email!: string;
  password!: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const user = await this.usersService.signup(body.email, body.password);
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const ok = await this.usersService.verifyCredentials(body.email, body.password);
    return { success: ok };
  }
}

