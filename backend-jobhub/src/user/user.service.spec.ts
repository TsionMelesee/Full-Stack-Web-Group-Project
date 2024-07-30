import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';

const mockPrismaService = {
  user: {
    findMany: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'DATABASE_URL') {
      return 'mock_database_url';
    }
  }),
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'ConfigService', useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a user successfully', async () => {
    const userId = '1';
    const updateDto: UpdateUserDto = {
      username: 'newUsername',
      email: 'newEmail@example.com',
    
    };

    mockPrismaService.user.update.mockResolvedValue({ id: userId, ...updateDto });

    const result = await service.updateUser(userId, updateDto);

    expect(result).toEqual({ id: userId, ...updateDto });
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: updateDto,
    });
  });

  it('should handle a missing userId during user update', async () => {
    const updateDto: UpdateUserDto = {
      username: 'newUsername',
      email: 'newEmail@example.com',
    };
  
    
    expect(mockPrismaService.user.update).not.toHaveBeenCalled();
  });
  

  it('should handle errors during user update', async () => {
    const userId = '1';
    const updateDto: UpdateUserDto = {
      username: 'newUsername',
      email: 'newEmail@example.com',
      
    };

  
  });



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'ConfigService', useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return all users', async () => {
    const mockUsers: {
      id: string;
      username: string;
      email: string;
      hash: string;
      userrole: UserRole;
      password: string;
      name: string;
    }[] = [
      { id: '1', username: 'user1', email: 'user1@example.com', hash: 'hash1', userrole: 'USER', password: 'password1', name: 'John Doe' },
      { id: '2', username: 'user2', email: 'user2@example.com', hash: 'hash2', userrole: 'ADMIN', password: 'password2', name: 'Jane Doe' },
    ];
    mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

    const result = await service.getAllUsers();

    console.log('Received:', result);

    expect(result).toEqual(mockUsers);
    expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
  });
});


  
  describe('UserService', () => {
    let service: UserService;
    let prismaService: PrismaService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [ConfigModule.forRoot()],
        providers: [
          UserService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: 'ConfigService', useValue: mockConfigService },
        ],
      }).compile();
  
      service = module.get<UserService>(UserService);
      prismaService = module.get<PrismaService>(PrismaService);
    });
  
    it('should delete a user successfully', async () => {
      const userId = '1';
  
      mockPrismaService.user.delete.mockResolvedValue({ id: userId });
  
      const result = await service.deleteUser(userId);
  
      expect(result).toEqual({
        statusCode: 200,
        message: `User with ID ${userId} successfully deleted`,
      });
  
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  
    it('should handle errors during user deletion', async () => {
      const userId = '1';
  
    });
  });


  
  afterEach(() => {
    jest.clearAllMocks();
  });








