import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateDocumentDto } from './create-document.dto';

export class CreateDocumentWithFileDto extends CreateDocumentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}