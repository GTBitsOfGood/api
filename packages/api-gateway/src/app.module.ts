import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { FileProviderModule } from './modules/file_provider/file_provider.module';
import { FileDownloadModule } from './modules/file_download/file_download.module';
import { FileUploadModule } from './modules/file_upload/file_upload.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    AuthModule,
    ProjectModule,
    UserModule,
    EmailModule,
    FileProviderModule,
    FileDownloadModule,
    FileUploadModule,
  ],
})
export class AppModule {}
