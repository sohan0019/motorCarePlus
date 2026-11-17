import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VehicleService } from './vehicle.service';
import { CreateMakeDto, CreateModelDto, GetMakesQueryDto, GetModelsQueryDto, } from './dto/vehicle.dto';
import { RoleEnum } from '../../common/enums/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guard';

@Controller('vehicles/catalog')
export class VehicleCatalogController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('makes')
  findAllMakes(@Query() query: GetMakesQueryDto) {
    return this.vehicleService.findAllMakes(query);
  }

  @Get('makes-with-models')
  findAllMakesWithModels(@Query() query: GetMakesQueryDto) {
    return this.vehicleService.findAllMakesWithModels(query);
  }

  @Post('makes')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  createMake(@Body() createMakeDto: CreateMakeDto) {
    return this.vehicleService.createMake(createMakeDto);
  }

  @Get('models')
  findAllModels(@Query() query: GetModelsQueryDto) {
    return this.vehicleService.findAllModels(query);
  }

  @Post('models')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleEnum.ADMIN)
  createModel(@Body() createModelDto: CreateModelDto) {
    return this.vehicleService.createModel(createModelDto);
  }
}