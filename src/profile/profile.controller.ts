import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard.js';
import { ProfileService } from './profile.service.js';
import { CreateOrUpdateProfileDTO } from './dto/createOrUpdateProfile.dto.js';
import { User } from '../auth/entities/user.entity.js';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async updateOrCreateProfile(
    @Request() request: { user: { sub: string } },
    @Body() createOrUpdateProfileDTO: CreateOrUpdateProfileDTO,
  ): Promise<{ message: string }> {
    return await this.profileService.updateOrCreateProfile(
      request.user.sub,
      createOrUpdateProfileDTO,
    );
  }

  @Get()
  async getUserProfile(
    @Request() req: { user: { sub: string } },
  ): Promise<User | null> {
    return this.profileService.getUserProfileByToken(req.user.sub);
  }
}
