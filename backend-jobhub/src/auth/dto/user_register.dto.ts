
import { IsString, Length } from 'class-validator';

export class RegisterUsersDto {
  @IsString()
  @Length(4, 10)
  username!: string;

  @IsString()
  @Length(5, 12)
  password!: string;

 

  @IsString()
 
  email!: string;
}
