import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';

// Mock UserService
class MockUserService {
  getAllUsers() {
    return [];
  }

deleteUser(userId: string) {
    return { statusCode: 200, message: `User with ID ${userId} successfully deleted` };
  }
  getProfile(userId: string) {
    // Mock implementation for getProfile
    // You can customize this based on your requirements
    return {
      id: userId,
      username: 'mockUsername',
      email: 'mockEmail@example.com',
      hash: 'mockHash',
      userrole: UserRole.USER,
      password: 'mockPassword',
      name: 'mockName',
    };
}}

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useClass: MockUserService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          hash: 'hash1',
          userrole: UserRole.USER,
          password: 'password1',
          name: 'John Doe',
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          hash: 'hash2',
          userrole: UserRole.ADMIN,
          password: 'password2',
          name: 'Jane Doe',
        },
      ];
      
      jest.spyOn(userService, 'getAllUsers').mockResolvedValue(mockUsers);

      const result = await userController.getAllUsers();

      expect(result).toEqual(mockUsers);
    });

  
  });
  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = '1';

      jest.spyOn(userService, 'deleteUser').mockResolvedValue({ statusCode: 200, message: `User with ID ${userId} successfully deleted` });

      const result = await userController.deleteUser(userId);

      expect(result).toEqual({ statusCode: 200, message: `User with ID ${userId} successfully deleted` });
     
    });

    it('should handle errors during user deletion', async () => {
      const userId = '1';
      const errorMessage = 'Some error';


      const result = await userController.deleteUser(userId);

      
    });
  });
  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const userId = '1';

      const result = await userController.getProfile(userId);

      expect(result).toEqual({
        id: userId,
        username: 'mockUsername',
        email: 'mockEmail@example.com',
        hash: 'mockHash',
        userrole: UserRole.USER,
        password: 'mockPassword',
        name: 'mockName',
      });
    });
});});