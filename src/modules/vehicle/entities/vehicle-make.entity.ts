import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { VehicleModelEntity } from './vehicle-model.entity';
import { VehicleTypeEnum } from '../../../common/enums/vehicle-type.enum';

@Entity('vehicle_makes')
@Unique(['name', 'vehicle_type'])
export class VehicleMakeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  vehicle_type!: VehicleTypeEnum;

  @OneToMany(() => VehicleModelEntity, (model) => model.make)
  models!: VehicleModelEntity[];
}