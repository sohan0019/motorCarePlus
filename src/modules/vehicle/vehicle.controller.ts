import { Controller, Get, Post, Put, Body, Param, Delete, Query, ParseUUIDPipe, } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { QueryParserPipe } from '../../common/pipes/QueryParserPipe';
import { VehicleEntity } from './entities/vehicle.entity';

// TODO (after auth): user_id comes from @CurrentUser() and JwtGuard is added.
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  // example: GET /vehicles?user_id=<uuid>&type=car&limit=10&offset=0
  @Get()
  findAll(
    @Query(new QueryParserPipe('MANY', ['registration_number']))
    query: FindManyOptions<VehicleEntity>,
  ) {
    return this.vehicleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehicleService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehicleService.remove(id);
  }
}