import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import * as request from 'supertest';
import { FileBucketProto } from 'juno-proto';
import * as GRPC from '@grpc/grpc-js';
import * as ProtoLoader from '@grpc/proto-loader';

let app: INestApplication;
let apiKey: string | undefined = undefined;
const ADMIN_EMAIL = 'test-superadmin@test.com';
const ADMIN_PASSWORD = 'test-password';

async function APIKeyForProjectName(projectName: string): Promise<string> {
  const key = await request(app.getHttpServer())
    .post('/auth/key')
    .set('X-User-Email', ADMIN_EMAIL)
    .set('X-User-Password', ADMIN_PASSWORD)
    .send({
      environment: 'prod',
      project: {
        name: projectName,
      },
    });

  return key.body['apiKey'];
}

beforeAll(async () => {
  const proto = ProtoLoader.loadSync(['reset.proto']) as any;
  const protoGRPC = GRPC.loadPackageDefinition(proto) as any;
  const resetClient = new protoGRPC.juno.reset_db.DatabaseReset(
    process.env.DB_SERVICE_ADDR,
    GRPC.credentials.createInsecure(),
  );
  await new Promise((resolve) => {
    resetClient.resetDb({}, () => {
      resolve(0);
    });
  });
});

afterAll((done) => {
  app.close();
  done();
});

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.init();

  if (!apiKey) {
    apiKey = await APIKeyForProjectName('test-seed-project');
  }
});

describe('File Bucket Routes', () => {
  it('Creating a bucket successfully', () => {
    const fileBucketBody: FileBucketProto.RegisterBucketRequest = {
      name: 'Test Bucket',
      configId: 1,
      fileProviderName: 'Test Provider',
      FileServiceFile: [],
    };

    return request(app.getHttpServer())
      .post('/file/bucket')
      .set('Authorization', 'Bearer ' + apiKey)
      .send(fileBucketBody)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Test Bucket');
        expect(res.body).toHaveProperty('configId', 1);
        expect(res.body).toHaveProperty('fileProviderName', 'Test Provider');
      });
  });

  it('Unsuccessful creation due to missing bucket name', () => {
    const fileBucketBody: FileBucketProto.RegisterBucketRequest = {
      name: '',
      configId: 1,
      fileProviderName: 'Test Provider',
      FileServiceFile: [],
    };

    return request(app.getHttpServer())
      .post('/file/bucket')
      .set('Authorization', 'Bearer ' + apiKey)
      .send(fileBucketBody)
      .expect(400);
  });

  it('Unsuccessful creation due to missing config ID', () => {
    const fileBucketBody: FileBucketProto.RegisterBucketRequest = {
      name: 'Test Bucket',
      configId: undefined,
      fileProviderName: 'Test Provider',
      FileServiceFile: [],
    };

    return request(app.getHttpServer())
      .post('/file/bucket')
      .set('Authorization', 'Bearer ' + apiKey)
      .send(fileBucketBody)
      .expect(400);
  });

  it('Unsuccessful creation due to missing file provider name', () => {
    const fileBucketBody: FileBucketProto.RegisterBucketRequest = {
      name: 'Test Bucket',
      configId: 1,
      fileProviderName: '',
      FileServiceFile: [],
    };

    return request(app.getHttpServer())
      .post('/file/bucket')
      .set('Authorization', 'Bearer ' + apiKey)
      .send(fileBucketBody)
      .expect(400);
  });

  it('Creating an existing bucket (should fail)', async () => {
    const fileBucketBody: FileBucketProto.RegisterBucketRequest = {
      name: 'Test Bucket',
      configId: 1,
      fileProviderName: 'Test Provider',
      FileServiceFile: [],
    };

    await request(app.getHttpServer())
      .post('/file/bucket')
      .set('Authorization', 'Bearer ' + apiKey)
      .send(fileBucketBody);

    return request(app.getHttpServer())
      .post('/file/bucket')
      .set('Authorization', 'Bearer ' + apiKey)
      .send(fileBucketBody);
  });
});
