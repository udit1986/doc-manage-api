import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto, UpdateDocumentDto } from '../common/dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);
    return await this.documentRepository.save(document);
  }

  async findAll(): Promise<{ entities: Document[]; total: number }> {
    return await this.documentRepository.findAndCount();
  }

  async findOne(id: number): Promise<Document> {
    return await this.documentRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    await this.documentRepository.update(id, updateDocumentDto);
    return await this.documentRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.documentRepository.delete(id);
  }
}
