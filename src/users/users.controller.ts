import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { AuthGuard } from '../auth/guard/auth.guard.js';
import { Role } from '../auth/enum/role.enum.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { FindOneParams } from './dto/find-one.params.js';
import { UpdateRoleDTO } from './dto/update-role.dto.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param() params: FindOneParams) {
    return await this.usersService.findById(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateRoleDTO: UpdateRoleDTO,
  ) {
    return await this.usersService.updateRole(params.id, updateRoleDTO);
  }
}
