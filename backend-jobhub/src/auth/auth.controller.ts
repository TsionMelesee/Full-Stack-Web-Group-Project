
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/user_login.dto';
import { RegisterUsersDto } from './dto/user_register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res): Promise<any> {
    try {
      const { token, userId } = await this.authService.loginUser(loginDto);
  
      return res.status(HttpStatus.OK).json({ token, userId });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
  }
  

  
  @Post('register')
async register(@Body() registerDto: RegisterUsersDto, @Res() res): Promise<any> {
  try {
    const token = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json({ token });
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Registration failed' });
  }
}

  

  
}
