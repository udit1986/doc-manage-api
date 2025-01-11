import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto, UpdateDocumentDto } from '../common/dto';
import { IPaginationOptions } from '../common/utils/types/pagination-options';

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

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    const [entities, total] = await this.documentRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
    return {
      total,
      entities,
    };
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

  async remove(id: number): Promise<boolean> {
    try {
      await this.documentRepository.delete(id);
      return true;
    } catch (_error) {
      return false;
    }
  }
}
