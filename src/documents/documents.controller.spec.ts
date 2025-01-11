import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto } from '../common/dto';
import { Document } from './documents.entity';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument: Document = {
    id: 1,
    title: 'Test Title',
    content: 'Test Content',
    author: 'Test Author',
    filePath: 'test/path',
    isActive: true,
    createDateTime: new Date(),
    createdBy: 'testUser',
    lastChangedDateTime: new Date(),
    lastChangedBy: 'testUser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn(),
            findManyWithPagination: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
      };
      const result = { ...mockDocument, ...createDocumentDto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      await expect(controller.create(createDocumentDto)).resolves.toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      const result = { entities: [mockDocument], total: 1 };
      jest.spyOn(service, 'findManyWithPagination').mockResolvedValue(result);

      await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toStrictEqual({
        data: result.entities,
        hasNextPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single document', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocument);

      await expect(controller.findOne(1)).resolves.toBe(mockDocument);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const updateDocumentDto: UpdateDocumentDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        author: 'Updated Author',
      };
      const result = { ...mockDocument, ...updateDocumentDto };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      await expect(controller.update(1, updateDocumentDto)).resolves.toBe(
        result,
      );
    });
  });

  describe('remove', () => {
    it('should remove a document', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(true);

      await expect(controller.remove(1)).resolves.toBe(true);
    });
  });
});
