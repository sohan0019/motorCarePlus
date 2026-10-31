import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { VehicleModelEntity } from './vehicle-model.entity';
import { VehicleTypeEnum } from '../../../common/enums/vehicle-type.enum';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ type: 'uuid' })
  model_id!: string;

  @ManyToOne(() => VehicleModelEntity)
  @JoinColumn({ name: 'model_id' })
  model!: VehicleModelEntity;

  @Column({ type: 'varchar' })
  type!: VehicleTypeEnum;

  @Column({ type: 'int', nullable: true })
  year!: number | null;

  @Column({ type: 'varchar', unique: true })
  registration_number!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}