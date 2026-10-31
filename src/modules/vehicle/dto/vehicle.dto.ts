import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { VehicleTypeEnum } from '../../../common/enums/vehicle-type.enum';

export class CreateVehicleDto {
  @IsEnum(VehicleTypeEnum, { message: 'Vehicle type must be either car or bike' })
  @IsNotEmpty()
  type!: VehicleTypeEnum;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle make cannot be empty' })
  make!: string;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle model cannot be empty' })
  model!: string;

  @IsInt({ message: 'Year must be a valid integer' })
  @Min(2000, { message: 'Year must be 2000 or later' })
  year!: number;

  @IsString()
  @IsNotEmpty({ message: 'Registration number cannot be empty' })
  registration_number!: string;
}