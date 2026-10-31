import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './entities/vehicle.entity';
import { VehicleMakeEntity } from './entities/vehicle-make.entity';
import { VehicleModelEntity } from './entities/vehicle-model.entity';
import { CreateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(VehicleMakeEntity)
    private readonly makeRepository: Repository<VehicleMakeEntity>,
    @InjectRepository(VehicleModelEntity)
    private readonly modelRepository: Repository<VehicleModelEntity>,
  ) {}

  async create(userId: string, createVehicleDto: CreateVehicleDto): Promise<VehicleEntity> {
    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      user_id: userId,
    });
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<VehicleEntity[]> {
    return this.vehicleRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id }, relations: ['user'] });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }

  async findAllMakes(): Promise<VehicleMakeEntity[]> {
    return this.makeRepository.find({ relations: ['models'] });
  }

  async findAllModels(): Promise<VehicleModelEntity[]> {
    return this.modelRepository.find({ relations: ['make'] });
  }
}