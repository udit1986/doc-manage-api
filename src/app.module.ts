import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { BaseAppModule } from './app/app.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DocumentsModule,
    IngestionModule,
    BaseAppModule
  ],
})
export class AppModule {}