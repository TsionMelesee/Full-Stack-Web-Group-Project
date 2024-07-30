import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from './decorator/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles, UserRole } from '../auth/decorator/roles.decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)  
  async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await this.userService.getAllUsers();
      return allUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      return []; 
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') userId: string) {
    try {
      const result = await this.userService.deleteUser(userId);
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error: 'Something went wrong' };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  uupdateUser(@Param('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }



  
 // @Get(':id')
  //@UseGuards(JwtAuthGuard)
 //async getUserById(@Param('id') userId: string): Promise<User> {
 //   const user = await this.userService.getUserById(userId);

  //  if (!user) {
    //  throw new NotFoundException(`User with ID ${userId} not found`);
    //}

   // return user;
  //}

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }
}
