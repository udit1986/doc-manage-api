import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum, Roles, RolesGuard } from '../roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { Document } from './documents.entity';
import {
  CreateDocumentDto,
  CreateDocumentWithFileDto,
  UpdateDocumentDto,
  InfinityPaginationResponseDto,
  QueryPaginationDto,
} from '../common/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { infinityPagination } from '../common/utils';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { User } from '../users';

@Controller('api/documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(RolesGuard)
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  async create(
    @Body() createDocumentDto: CreateDocumentDto,
    @CurrentUser() user: User,
  ): Promise<Document> {
    createDocumentDto.createdBy = user.id.toString();
    createDocumentDto.lastChangedBy = user.id.toString();
    return await this.documentsService.create(createDocumentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<InfinityPaginationResponseDto<Document>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    const resp = await this.documentsService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
    return infinityPagination(resp.entities, resp.total, { page, limit });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  async findOne(@Param('id') id: number) {
    return await this.documentsService.findOne(id);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @CurrentUser() user: User,
  ) {
    updateDocumentDto.lastChangedBy = user.id.toString();
    return await this.documentsService.update(id, updateDocumentDto);
  }

  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async remove(@Param('id') id: number, @CurrentUser() user: User) {
    return await this.documentsService.remove(id, user.id.toString());
  }

  @Post('upload')
  @Roles(RoleEnum.admin, RoleEnum.editor)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDocumentWithFileDto })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentWithFileDto,
    @CurrentUser() user: User,
  ) {
    // Check file type and size
    if (file.mimetype !== 'text/plain') {
      throw new BadRequestException('Only .txt files are allowed');
    }
    if (file.size > 10240) {
      // 10KB
      throw new BadRequestException('File size must be less than 10KB');
    }
    // Generate a unique filename
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname}`;

    // Save the file to a specific location
    // in real world will save it to AWS S3 or any blob storage
    const uploadPath = path.join(__dirname, '../../uploads', uniqueFilename);
    fs.writeFileSync(uploadPath, file.buffer);

    // Create a new document entry in the database
    createDocumentDto.filePath = uploadPath;
    createDocumentDto.createdBy = user.id.toString();
    createDocumentDto.lastChangedBy = user.id.toString();
    const document = await this.documentsService.create(createDocumentDto);

    return { message: 'File uploaded successfully', document };
  }
}
