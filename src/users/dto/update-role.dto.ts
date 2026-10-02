import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/enum/role.enum.js';

export class UpdateRoleDTO {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
