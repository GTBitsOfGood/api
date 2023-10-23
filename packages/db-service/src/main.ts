import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DBSERVICE_USER_PACKAGE_NAME } from './gen/user';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  ConfigModule.forRoot({
    envFilePath: join(__dirname, '../../../.env.local'),
  });
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [DBSERVICE_USER_PACKAGE_NAME],
        protoPath: [join(__dirname, '../../proto/db-service/user.proto')],
        url: process.env.DB_SERVICE_ADDR,
      },
    },
  );
  await app.listen();
}
bootstrap();
