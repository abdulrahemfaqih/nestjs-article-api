import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { UpdateRoleDTO } from './dto/update-role.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    }
    return user;
  }

  async updateRole(
    id: string,
    updateRoleDTO: UpdateRoleDTO,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const user = await this.findById(id);
    user.role = updateRoleDTO.role;
    const savedUser = await this.userRepository.save(user);

    const { password: _password, ...userWithoutPassword } = savedUser;
    return {
      message: 'Role berhasil diubah',
      user: userWithoutPassword as Omit<User, 'password'>,
    };
  }
}
