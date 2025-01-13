import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '../config';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly ingestionUrl = this.configService.get('INGESTION_URL');
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async triggerIngestion(): Promise<any> {
    return await this.getAxios('trigger');
  }

  async getIngestionStatus(): Promise<any> {
    return await this.getAxios('status');
  }

  async ingestDocument(documentData: any): Promise<any> {
    return await this.postAxios('trigger', documentData);
  }

  async askQuestion(questionData: any): Promise<any> {
    return await this.postAxios('trigger', questionData);
  }

  async selectDocuments(selectionData: any): Promise<any> {
    return await this.postAxios('trigger', selectionData);
  }

  async getAxios(relativeURL: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get(this.ingestionUrl + relativeURL).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new Error('An error happened!');
        }),
      ),
    );
    return data;
  }

  async postAxios(relativeURL: string, requestBody: any): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.post(this.ingestionUrl + relativeURL, requestBody).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new Error('An error happened!');
        }),
      ),
    );
    return data;
  }
}
