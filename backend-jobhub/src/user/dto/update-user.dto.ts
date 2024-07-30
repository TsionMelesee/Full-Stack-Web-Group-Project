import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional() 
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @IsOptional() 
  @IsNotEmpty()
  email?: string;
}
