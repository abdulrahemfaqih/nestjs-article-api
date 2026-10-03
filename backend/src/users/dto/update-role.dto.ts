import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/enum/role.enum.js';

export class UpdateRoleDTO {
  @ApiProperty({
    enum: Role,
    description: 'Role baru untuk user',
    example: Role.ADMIN,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
