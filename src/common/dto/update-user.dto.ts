import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsEnum } from 'class-validator';
import { RoleEnum } from '../../roles/roles.enum';

export class UpdateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: RoleEnum.viewer, description: 'Role of the user', enum: RoleEnum })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
}