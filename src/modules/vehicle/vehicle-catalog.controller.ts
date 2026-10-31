import { Controller, Get } from '@nestjs/common';
import { VehicleService } from './vehicle.service';

@Controller('vehicles/catalog')
export class VehicleCatalogController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('makes')
  findAllMakes() {
    return this.vehicleService.findAllMakes();
  }

  @Get('models')
  findAllModels() {
    return this.vehicleService.findAllModels();
  }
}