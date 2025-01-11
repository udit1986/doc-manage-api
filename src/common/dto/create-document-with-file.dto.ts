import { ApiProperty } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';

export class CreateDocumentWithFileDto extends CreateDocumentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  filePath?: string;
}