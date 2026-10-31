import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleMakeEntity } from './vehicle-make.entity';

@Entity('vehicle_models')
export class VehicleModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'uuid' })
  make_id!: string;

  @ManyToOne(() => VehicleMakeEntity, (make) => make.models, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'make_id' })
  make!: VehicleMakeEntity;

}