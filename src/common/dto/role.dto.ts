import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty()
  id: number | string;
}