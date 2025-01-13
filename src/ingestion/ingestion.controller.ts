import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Ingestion triggered successfully' })
  async triggerIngestion() {
    return this.ingestionService.triggerIngestion();
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Ingestion status retrieved successfully' })
  async getIngestionStatus() {
    return this.ingestionService.getIngestionStatus();
  }

  @Post('ingest-document')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Document ingested successfully' })
  async ingestDocument(@Body() documentData: any) {
    return this.ingestionService.ingestDocument(documentData);
  }

  @Post('ask-question')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Question answered successfully' })
  async askQuestion(@Body() questionData: any) {
    return this.ingestionService.askQuestion(questionData);
  }

  @Post('select-documents')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Documents selected successfully' })
  async selectDocuments(@Body() selectionData: any) {
    return this.ingestionService.selectDocuments(selectionData);
  }
}