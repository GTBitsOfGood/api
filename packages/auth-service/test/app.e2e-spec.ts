import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as ProtoLoader from '@grpc/proto-loader';
import * as GRPC from '@grpc/grpc-js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  ApiKeyProto,
  ApiKeyProtoFile,
  HealthProto,
  HealthProtoFile,
  IdentifiersProtoFile,
  JwtProto,
  JwtProtoFile,
  ProjectProtoFile,
  ResetProtoFile,
  UserProto,
  UserProtoFile,
} from 'juno-proto';
import { User, UserType } from 'juno-proto/dist/gen/user';
import { sign } from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';

let app: INestMicroservice;

jest.setTimeout(15000);

async function initApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [
        ApiKeyProto.JUNO_API_KEY_PACKAGE_NAME,
        JwtProto.JUNO_JWT_PACKAGE_NAME,
        HealthProto.GRPC_HEALTH_V1_PACKAGE_NAME,
        UserProto.JUNO_USER_PACKAGE_NAME,
      ],
      protoPath: [
        ApiKeyProtoFile,
        HealthProtoFile,
        JwtProtoFile,
        UserProtoFile,
      ],
      url: process.env.AUTH_SERVICE_ADDR,
    },
  });

  await app.init();

  await app.listen();
  return app;
}

beforeAll(async () => {
  app = await initApp();

  const proto = ProtoLoader.loadSync([
    ResetProtoFile,
    IdentifiersProtoFile,
    UserProtoFile,
    ProjectProtoFile,
    ApiKeyProtoFile,
  ]) as any;

  const protoGRPC = GRPC.loadPackageDefinition(proto) as any;

  const resetClient = new protoGRPC.juno.reset_db.DatabaseReset(
    process.env.DB_SERVICE_ADDR,
    GRPC.credentials.createInsecure(),
  );
  const projectClient = new protoGRPC.juno.project.ProjectService(
    process.env.DB_SERVICE_ADDR,
    GRPC.credentials.createInsecure(),
  );
  const userClient = new protoGRPC.juno.user.UserService(
    process.env.DB_SERVICE_ADDR,
    GRPC.credentials.createInsecure(),
  );

  await new Promise((resolve) => {
    resetClient.resetDb({}, () => {
      resolve(0);
    });
  });

  await new Promise((resolve, reject) => {
    projectClient.createProject({ name: 'project' }, (err, resp) => {
      if (err) return reject(err);
      resolve(resp);
    });
  });

  // Create user
  await new Promise((resolve, reject) => {
    userClient.createUser(
      {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test-User',
        type: 'SUPERADMIN',
      },
      (err, resp) => {
        if (err) return reject(err);
        resolve(resp);
      },
    );
  });

  // Create unprivileged user
  await new Promise((resolve, reject) => {
    userClient.createUser(
      {
        email: 'test2@example.com',
        password: 'password123',
        name: 'Test-User',
        type: 'USER',
      },
      (err, resp) => {
        if (err) return reject(err);
        resolve(resp);
      },
    );
  });
});

afterAll(() => {
  app.close();
});

describe('Auth Service API Key Tests', () => {
  let apiKeyClient: any;

  beforeEach(async () => {
    const proto = ProtoLoader.loadSync(ApiKeyProtoFile) as any;

    const protoGRPC = GRPC.loadPackageDefinition(proto) as any;

    apiKeyClient = new protoGRPC.juno.api_key.ApiKeyService(
      process.env.AUTH_SERVICE_ADDR,
      GRPC.credentials.createInsecure(),
    );
  });

  it('issues an API key with correct parameters', async () => {
    const response = await new Promise((resolve, reject) => {
      apiKeyClient.issueApiKey(
        {
          project: { name: 'project' },
          email: 'test@example.com',
          password: 'password123',
          description: 'Valid API key',
          environment: 'dev',
        },
        (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        },
      );
    });

    expect(response).toBeDefined();
  });

  it('rejects new key creation with an invalid master password', async () => {
    await expect(
      new Promise((resolve, reject) => {
        apiKeyClient.issueApiKey(
          {
            project: { name: 'project' },
            email: 'test@example.com',
            password: 'notthepassword123',
            description: 'API key request with invalid password',
            environment: 'dev',
          },
          (err, resp) => {
            if (err) return reject(err);
            return resolve(resp);
          },
        );
      }),
    ).rejects.toBeDefined(); // Expecting an error due to invalid master password
  });

  it('rejects new key creation with an unprivileged user', async () => {
    await expect(
      new Promise((resolve, reject) => {
        apiKeyClient.issueApiKey(
          {
            project: { name: 'project' },
            email: 'test2@example.com',
            password: 'password123',
            description: 'API key request with unpriviledged user',
            environment: 'dev',
          },
          (err, resp) => {
            if (err) return reject(err);
            return resolve(resp);
          },
        );
      }),
    ).rejects.toBeDefined(); // Expecting an error due to invalid master password
  });

  // it('revokes an API key', async () => {
  //   const promise = new Promise((resolve) => {
  //     client.revokeApiKey({}, (err, resp) => {
  //       expect(err).toBeNull();
  //       expect(resp).toStrictEqual({});
  //       resolve({});
  //     });
  //   });
  //
  //   await promise;
  // });
});

describe('Auth Service JWT Tests', () => {
  let jwtClient: any;
  let apiKeyClient: any;

  beforeEach(async () => {
    const proto = ProtoLoader.loadSync([JwtProtoFile, ApiKeyProtoFile]) as any;

    const protoGRPC = GRPC.loadPackageDefinition(proto) as any;

    jwtClient = new protoGRPC.juno.jwt.JwtService(
      process.env.AUTH_SERVICE_ADDR,
      GRPC.credentials.createInsecure(),
    );

    apiKeyClient = new protoGRPC.juno.api_key.ApiKeyService(
      process.env.AUTH_SERVICE_ADDR,
      GRPC.credentials.createInsecure(),
    );
  });

  it('creates a valid JWT', async () => {
    const key = await new Promise((resolve, reject) => {
      apiKeyClient.issueApiKey(
        {
          project: { name: 'project' },
          email: 'test@example.com',
          password: 'password123',
          description: 'Valid API key',
          environment: 'dev',
        },
        (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        },
      );
    });
    expect(key['apiKey']).toBeDefined();
    const apiKey = key['apiKey'];

    // expected JWT
    const apiKeyHash = createHash('sha256').update(apiKey).digest('hex');
    const expectedJwt = sign(
      {
        apiKeyHash: apiKeyHash,
      },
      process.env.JWT_SECRET ?? 'secret',
    );

    const response = await new Promise((resolve, reject) => {
      jwtClient.createJwt({ apiKey: apiKey }, (err, resp) => {
        if (err) return reject(err);
        return resolve(resp);
      });
    });

    expect(response['jwt']).toBeDefined();
    expect(response['jwt']).toStrictEqual(expectedJwt);
  });

  it('creates a JWT with non-existent apiKey', async () => {
    const apiKey = 'non-existent apiKey';

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.createJwt({ apiKey: apiKey }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined(); // Expecting an error because apiKey does not exist in DB
  });

  it('creates a JWT with empty apiKey', async () => {
    const apiKey = '';

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.createJwt({ apiKey: apiKey }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined(); // Expecting an error because apiKey is empty (non-existent in DB)
  });

  it('creates a JWT with null apiKey', async () => {
    const apiKey = null;

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.createJwt({ apiKey: apiKey }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined(); // Expecting an error because apiKey is null (non-existent in DB)
  });

  it('validates a valid JWT whose apiKeyHash is in DB', async () => {
    const key = await new Promise((resolve, reject) => {
      apiKeyClient.issueApiKey(
        {
          project: { name: 'project' },
          email: 'test@example.com',
          password: 'password123',
          description: 'Valid API key',
          environment: 'dev',
        },
        (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        },
      );
    });
    expect(key['apiKey']).toBeDefined();
    const apiKey = key['apiKey'];

    const jwtResponse = await new Promise((resolve, reject) => {
      jwtClient.createJwt({ apiKey: apiKey }, (err, resp) => {
        if (err) return reject(err);
        return resolve(resp);
      });
    });
    expect(jwtResponse['jwt']).toBeDefined();
    const jwt = jwtResponse['jwt'];

    const response = await new Promise((resolve, reject) => {
      jwtClient.validateJwt({ jwt: jwt }, (err, resp) => {
        if (err) return reject(err);
        return resolve(resp);
      });
    });

    expect(response['valid']).toBeDefined();
    expect(response['valid']).toEqual(true);
  });

  it('validates a empty JWT', async () => {
    const jwt = '';

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.validateJwt({ jwt: jwt }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined();
  });

  it('validates a null JWT', async () => {
    const jwt = null;

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.validateJwt({ jwt: jwt }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined();
  });

  it('validates a JWT whose apiKeyHash is not in DB', async () => {
    const apiKeyHash = createHash('sha256')
      .update(randomBytes(32).toString('hex'))
      .digest('hex');
    const jwt = sign(
      {
        apiKeyHash: apiKeyHash,
      },
      process.env.JWT_SECRET ?? 'secret',
    );

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.validateJwt({ jwt: jwt }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined(); // Expecting an error because apiKey is not in DB
  });

  it('validates an expired JWT whose apiKeyHash is in DB', async () => {
    const key = await new Promise((resolve, reject) => {
      apiKeyClient.issueApiKey(
        {
          project: { name: 'project' },
          email: 'test@example.com',
          password: 'password123',
          description: 'Valid API key',
          environment: 'dev',
        },
        (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        },
      );
    });
    expect(key['apiKey']).toBeDefined();
    const apiKey = key['apiKey'];

    const apiKeyHash = createHash('sha256').update(apiKey).digest('hex');
    const jwt = sign(
      {
        apiKeyHash: apiKeyHash,
      },
      process.env.JWT_SECRET ?? 'secret',
      {
        expiresIn: -30,
      },
    );

    await expect(
      new Promise((resolve, reject) => {
        jwtClient.validateJwt({ jwt: jwt }, (err, resp) => {
          if (err) return reject(err);
          return resolve(resp);
        });
      }),
    ).rejects.toBeDefined(); // Expecting an error because jwt is expired
  });
});

describe('User authentication tests', () => {
  let client: any;

  const correctUserResponse: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test-User',
    type: UserType.SUPERADMIN,
  };

  beforeEach(async () => {
    const proto = ProtoLoader.loadSync(UserProtoFile) as any;

    const protoGRPC = GRPC.loadPackageDefinition(proto) as any;

    client = new protoGRPC.juno.user.UserAuthService(
      process.env.AUTH_SERVICE_ADDR,
      GRPC.credentials.createInsecure(),
    );
  });
  it('User auth with an invalid email format', async () => {
    const promise = new Promise((resolve, reject) => {
      client.authenticate(
        { email: 'testing', password: 'password123' },
        (err, resp) => {
          if (err) reject(err);
          resolve(resp);
        },
      );
    });
    try {
      await promise;
    } catch (e) {
      expect(e.toString()).toContain('No user found for email');
    }
  });
  it('User auth with an invalid email that is not in the database', async () => {
    const promise = new Promise((resolve, reject) => {
      client.authenticate(
        { email: 'invalid@example.com', password: 'password123' },
        (err, resp) => {
          if (err) reject(err);
          resolve(resp);
        },
      );
    });
    try {
      await promise;
    } catch (e) {
      expect(e.toString()).toContain('No user found for email');
    }
  });

  it('User auth with an empty password', async () => {
    const promise = new Promise((resolve, reject) => {
      client.authenticate(
        { email: 'test@example.com', password: '' },
        (err, resp) => {
          if (err) reject(err);
          resolve(resp);
        },
      );
    });

    try {
      await promise;
    } catch (e) {
      expect(e.toString()).toContain('Incorrect password');
    }
  });
  it('User auth with an invalid password and user within db', async () => {
    const promise = new Promise((resolve, reject) => {
      client.authenticate(
        { email: 'test@example.com', password: 'testing' },
        (err, resp) => {
          if (err) reject(err);
          resolve(resp);
        },
      );
    });

    try {
      await promise;
    } catch (e) {
      expect(e.toString()).toContain('Incorrect password');
    }
  });

  it('User auth with correct credentials', async () => {
    const promise = new Promise((resolve, reject) => {
      client.authenticate(
        { email: 'test@example.com', password: 'password123' },
        (err, resp) => {
          if (err) reject(err);
          resolve(resp);
        },
      );
    });

    const res = await promise;
    res['id'] = Number(res['id']);
    expect(res).toStrictEqual(correctUserResponse);
  });
});
