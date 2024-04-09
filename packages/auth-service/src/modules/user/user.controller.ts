import { Controller, Inject } from '@nestjs/common';
import { UserProto } from 'juno-proto';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { AuthenticateUserRequest, User } from 'juno-proto/dist/gen/user';

@Controller('api_key')
@UserProto.UserAuthServiceControllerMethods()
export class UserController implements UserProto.UserAuthServiceController {
  private userService: UserProto.UserServiceClient;

  constructor(
    @Inject(UserProto.USER_SERVICE_NAME) private userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService<UserProto.UserServiceClient>(
      UserProto.USER_SERVICE_NAME,
    );
  }

  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: User,
  })
  @ApiBody({
    type: AuthenticateUserRequest,
    description: 'Payload to authenticate a user',
  })
  async authenticate(
    request: UserProto.AuthenticateUserRequest,
  ): Promise<UserProto.User> {
    let passwordHash: UserProto.UserPasswordHash;
    try {
      passwordHash = await lastValueFrom(
        this.userService.getUserPasswordHash({
          email: request.email,
        }),
      );
    } catch (e) {
      console.log(`${JSON.stringify(e)}`);
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'No user found for email',
      });
    }

    try {
      const passwordEquals = await bcrypt.compare(
        request.password,
        passwordHash.hash,
      );
      if (!passwordEquals) {
        throw new RpcException({
          code: status.PERMISSION_DENIED,
          message: 'Incorrect password',
        });
      }
      return lastValueFrom(
        this.userService.getUser({
          email: request.email,
        }),
      );
    } catch (e) {
      throw e;
    }
  }
}
