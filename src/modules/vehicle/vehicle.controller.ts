import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/vehicle.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() body: { user_id: string } & CreateVehicleDto) {
    const { user_id, ...dto } = body;
    return this.vehicleService.create(user_id, dto);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}