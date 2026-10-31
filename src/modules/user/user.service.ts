import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { RoleEnum } from '../../common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase();
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const password_hash = await bcrypt.hash(createUserDto.password, 10);
    const saved = await this.userRepository.save(
      this.userRepository.create({
        email,
        password_hash,
        full_name: createUserDto.full_name,
        phone_number: createUserDto.phone_number ?? null,
        role: RoleEnum.USER, 
      }),
    );

    const { password_hash: _removed, ...safeUser } = saved;
    return safeUser;
  }

  async findAll(query: FindManyOptions<UserEntity>) {
    const [data, total] = await this.userRepository.findAndCount({
      order: { created_at: 'DESC' },
      take: 10,
      ...query,
      select: undefined,
    });
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
    await this.findOne(id);
    if (Object.keys(updateUserDto).length > 0) {
      await this.userRepository.update(id, updateUserDto);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted' };
  }
}