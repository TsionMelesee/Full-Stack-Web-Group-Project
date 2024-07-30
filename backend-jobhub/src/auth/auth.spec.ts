import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/user_login.dto';
import { RegisterUsersDto } from './dto/user_register.dto';
import { UserRole } from '../prisma/enum';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, UserService, ConfigService],
      imports: [
        JwtModule.register({
          secret: 'your-secret-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('loginUser', () => {
    it('should return token and userId when valid credentials are provided', async () => {
      authService['validateUserCredentials'] = jest.fn().mockResolvedValue({
        id: 'userId',
        username: 'testuser',
        userrole: 'user',
      });

      authService['userService']['getUserById'] = jest.fn().mockResolvedValue({
        id: 'userId',
      });

      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password',
      };

      const result = await authService.loginUser(loginDto);
      expect(result.token).toBeDefined();
      expect(result.userId).toEqual('userId');
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      authService['validateUserCredentials'] = jest.fn().mockResolvedValue(null);

      const loginDto: LoginDto = {
        username: 'invaliduser',
        password: 'invalidpassword',
      };

      await expect(authService.loginUser(loginDto)).rejects.toThrowError('Invalid credentials');
    });
  });

  it('should register a new user and return a valid token', async () => {
    jest.spyOn(jwtService, 'sign').mockReturnValue('generated-token');
    authService['hashPassword'] = jest.fn().mockResolvedValue('hashedPassword');
    authService['registerUser'] = jest.fn().mockResolvedValue({
    id: 'newUserId',
    username: 'newUser',
    userrole: UserRole.USER, 
  });

  const registerDto: RegisterUsersDto = {
    username: 'newUser',
    password: 'password123',
    email: 'newuser@example.com',
  };

  const result = await authService.register(registerDto);
  
    expect(authService['hashPassword']).toHaveBeenCalledWith(registerDto.password);
    expect(authService['registerUser']).toHaveBeenCalledWith({
      username: registerDto.username,
      password: 'hashedPassword',
      name: registerDto.username,
      email: registerDto.email,
      userrole: UserRole.USER,  
      hash: 'hashedPassword',
    });
  
    expect(result).toEqual('generated-token');
  });
  
  
      

    ;

    it('should throw an error when registration fails', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('generated-token');
      authService['hashPassword'] = jest.fn().mockResolvedValue('hashedPassword');
      authService['registerUser'] = jest.fn().mockRejectedValue(new Error('Registration failed'));

      const registerDto: RegisterUsersDto = {
        username: 'newUser',
        password: 'password123',
        email: 'newuser@example.com',
      };

     
    });
  });

