import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    triggerIngestion: jest.fn(),
    getIngestionStatus: jest.fn(),
    ingestDocument: jest.fn(),
    askQuestion: jest.fn(),
    selectDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('triggerIngestion', () => {
    it('should trigger ingestion', async () => {
      const result = { message: 'Ingestion triggered successfully' };
      jest.spyOn(service, 'triggerIngestion').mockResolvedValue(result);

      await expect(controller.triggerIngestion()).resolves.toBe(result);
    });
  });

  describe('getIngestionStatus', () => {
    it('should return ingestion status', async () => {
      const result = { status: 'In Progress' };
      jest.spyOn(service, 'getIngestionStatus').mockResolvedValue(result);

      await expect(controller.getIngestionStatus()).resolves.toBe(result);
    });
  });

  describe('ingestDocument', () => {
    it('should ingest document', async () => {
      const documentData = { title: 'Test Document', content: 'This is a test document.' };
      const result = { message: 'Document ingested successfully' };
      jest.spyOn(service, 'ingestDocument').mockResolvedValue(result);

      await expect(controller.ingestDocument(documentData)).resolves.toBe(result);
    });
  });

  describe('askQuestion', () => {
    it('should answer question', async () => {
      const questionData = { question: 'What is the capital of France?' };
      const result = { answer: 'The capital of France is Paris.' };
      jest.spyOn(service, 'askQuestion').mockResolvedValue(result);

      await expect(controller.askQuestion(questionData)).resolves.toBe(result);
    });
  });

  describe('selectDocuments', () => {
    it('should select documents', async () => {
      const selectionData = { documentIds: [1, 2, 3] };
      const result = { message: 'Documents selected successfully' };
      jest.spyOn(service, 'selectDocuments').mockResolvedValue(result);

      await expect(controller.selectDocuments(selectionData)).resolves.toBe(result);
    });
  });
});