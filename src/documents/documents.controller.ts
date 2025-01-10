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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from '../common/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/documents')
@ApiBearerAuth()
@ApiTags('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    const resp = this.documentsService.findAll();
    return infinityPagination(resp.entities, resp.total, { page, limit });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  findOne(@Param('id') id: number) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiBody({ type: UpdateDocumentDto })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  remove(@Param('id') id: number) {
    return this.documentsService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ) {
    // Check file type and size
    if (file.mimetype !== 'text/plain') {
      throw new BadRequestException('Only .txt files are allowed');
    }
    if (file.size > 10240) {
      // 10KB
      throw new BadRequestException('File size must be less than 10KB');
    }

    // Save the file to a specific location
    const uploadPath = path.join(__dirname, '../../uploads', file.originalname);
    fs.writeFileSync(uploadPath, file.buffer);

    // Create a new document entry in the database
    createDocumentDto.filePath = uploadPath;
    const document = await this.documentsService.create(createDocumentDto);

    return { message: 'File uploaded successfully', document };
  }
}
