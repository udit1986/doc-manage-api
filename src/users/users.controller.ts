import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { RoleEnum, Roles, RolesGuard } from '../roles';
import { infinityPagination } from '../common/utils';
import {
  InfinityPaginationResponseDto,
  UpdateUserDto,
  QueryUserDto,
} from '../common/dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';

@ApiBearerAuth()
@Controller('api/users')
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 201, description: 'Successful Response' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: User['id'],
    @Body() updateProfileDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<User | null> {
    updateProfileDto.lastChangedBy = user.id.toString();
    return this.usersService.update(id, updateProfileDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;

    const resp = await this.usersService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
    return infinityPagination(
      resp.entities,
      resp.total,
      { page, limit },
    );
  }
}
