
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client'; 
import { PrismaService } from '../prisma/prisma.service';

type HashFunction = (password: string, saltOrRounds: number) => Promise<string>;
type UserProfile = {
  id: string;
  username: string;
  email: string;
} | null;


@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await this.db.user.findMany();
      return allUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  


  async deleteUser(userId: string) {
    try {
      await this.db.user.delete({
        where: { id: userId },
      });
      return {
        statusCode: 200,
        message: `User with ID ${userId} successfully deleted`,
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  }
  
  

 
 
  async updateUser(userId: string, dto: UpdateUserDto) {
    try {
      console.log('Received userId:', userId);
  
      if (!userId) {
        throw new BadRequestException('UserId is required for updating the user.');
      }
  
      const user = await this.db.user.update({
        where: { id: userId },
        data: { ...dto },
      });
  
      
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  
 
  async getProfile(userId: string): Promise<UserProfile> {
    try {
      const userProfile = await this.db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
  
      if (!userProfile) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      return userProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
  

  async getUserById(userId: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id: userId },
    });
  }


}



  
  
  
  
  
  
  
