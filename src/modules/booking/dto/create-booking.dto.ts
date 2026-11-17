import { IsDateString, IsInt, IsNotEmpty, IsString,  Matches, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  service_id!: number;

  @IsString()
  @IsNotEmpty()
  vehicle_model!: string;

  @IsDateString()
  booking_date!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  start_time!: string;
}
