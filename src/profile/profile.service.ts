import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity.js';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { CreateOrUpdateProfileDTO } from './dto/createOrUpdateProfile.dto.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateOrCreateProfile(
    userId: string,
    createOrUpdateProfileDTO: CreateOrUpdateProfileDTO,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user tidak ditemukan');
    }
    if (user.profile) {
      Object.assign(user.profile, createOrUpdateProfileDTO);
      await this.profileRepository.save(user.profile);
      return {
        message: 'Profile berhasil di update',
      };
    } else {
      const newProfile = this.profileRepository.create(
        createOrUpdateProfileDTO,
      );
      newProfile.user = user;
      await this.profileRepository.save(newProfile);
      return {
        message: 'Profile berhasil di buat',
      };
    }
  }
}
