import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { RoleEnum } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/,{message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'})
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  full_name!: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  full_name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
}