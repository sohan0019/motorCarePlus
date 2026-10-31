import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateMakeDto, CreateModelDto, GetMakesQueryDto, GetModelsQueryDto, } from './dto/vehicle.dto';

@Controller('vehicles/catalog')
export class VehicleCatalogController {
  constructor(private readonly vehicleService: VehicleService) {}

  // GET /vehicles/catalog/makes?type=car
  @Get('makes')
  findAllMakes(@Query() query: GetMakesQueryDto) {
    return this.vehicleService.findAllMakes(query);
  }

  // TODO (after auth): admin only
  @Post('makes')
  createMake(@Body() createMakeDto: CreateMakeDto) {
    return this.vehicleService.createMake(createMakeDto);
  }

  // GET /vehicles/catalog/models?make_id=<uuid>
  @Get('models')
  findAllModels(@Query() query: GetModelsQueryDto) {
    return this.vehicleService.findAllModels(query);
  }

  // TODO (after auth): admin only
  @Post('models')
  createModel(@Body() createModelDto: CreateModelDto) {
    return this.vehicleService.createModel(createModelDto);
  }
}