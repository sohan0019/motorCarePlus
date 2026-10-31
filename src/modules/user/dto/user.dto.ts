import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
    message: 'Password must be at least 6 characters long and contain at least one letter and one number',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  full_name!: string;

  @IsOptional()
  @IsString()
  phone_number?: string;
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