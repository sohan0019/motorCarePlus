import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { VehicleCatalogController } from './vehicle-catalog.controller';
import { VehicleEntity } from './entities/vehicle.entity';
import { VehicleMakeEntity } from './entities/vehicle-make.entity';
import { VehicleModelEntity } from './entities/vehicle-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity, VehicleMakeEntity, VehicleModelEntity])],
  controllers: [VehicleController, VehicleCatalogController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}