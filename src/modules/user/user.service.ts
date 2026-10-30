import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      ...createUserDto,
      password_hash,
    });

    return this.userRepository.save(user);
  }

  async findAll(query: any): Promise<{ data: UserEntity[]; total: number }> {
    const { skip, take, sortBy, sortOrder, search, filter } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.full_name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (filter) {
      Object.keys(filter).forEach((key) => {
        queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: filter[key] });
      });
    }

    if (sortBy) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder || 'ASC');
    } else {
      queryBuilder.orderBy('user.created_at', 'DESC');
    }

    queryBuilder.skip(skip || 0).take(take || 10);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}