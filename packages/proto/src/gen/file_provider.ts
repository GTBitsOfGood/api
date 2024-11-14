// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v5.28.3
// source: file_provider.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Bucket } from './file_bucket';

export const protobufPackage = 'juno.file_service.provider';

export interface FileProvider {
  providerName: string;
  accessKey: string;
  metadata: string;
  bucket: Bucket[];
}

export interface GetFileProviderRequest {
  providerName: string;
}

export interface CreateFileProviderRequest {
  providerName: string;
  accessKey: string;
  metadata: string;
  bucket: Bucket[];
}

export interface UpdateFileProviderRequest {
  providerName: string;
  accessKey?: string | undefined;
  metadata?: string | undefined;
  bucket: Bucket[];
}

export interface DeleteFileProviderRequest {
  providerName: string;
}

export interface RegisterProviderRequest {
  providerName: string;
  publicAccessKey: string;
  privateAccessKey: string;
  baseUrl: string;
}

export interface RemoveProviderRequest {
  providerName: string;
}

export const JUNO_FILE_SERVICE_PROVIDER_PACKAGE_NAME =
  'juno.file_service.provider';

export interface FileProviderDbServiceClient {
  getProvider(request: GetFileProviderRequest): Observable<FileProvider>;

  createProvider(request: CreateFileProviderRequest): Observable<FileProvider>;

  deleteProvider(request: DeleteFileProviderRequest): Observable<FileProvider>;

  updateProvider(request: UpdateFileProviderRequest): Observable<FileProvider>;
}

export interface FileProviderDbServiceController {
  getProvider(
    request: GetFileProviderRequest,
  ): Promise<FileProvider> | Observable<FileProvider> | FileProvider;

  createProvider(
    request: CreateFileProviderRequest,
  ): Promise<FileProvider> | Observable<FileProvider> | FileProvider;

  deleteProvider(
    request: DeleteFileProviderRequest,
  ): Promise<FileProvider> | Observable<FileProvider> | FileProvider;

  updateProvider(
    request: UpdateFileProviderRequest,
  ): Promise<FileProvider> | Observable<FileProvider> | FileProvider;
}

export function FileProviderDbServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getProvider',
      'createProvider',
      'deleteProvider',
      'updateProvider',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('FileProviderDbService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('FileProviderDbService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const FILE_PROVIDER_DB_SERVICE_NAME = 'FileProviderDbService';

export interface FileProviderFileServiceClient {
  registerProvider(request: RegisterProviderRequest): Observable<FileProvider>;

  removeProvider(request: RegisterProviderRequest): Observable<FileProvider>;
}

export interface FileProviderFileServiceController {
  registerProvider(
    request: RegisterProviderRequest,
  ): Promise<FileProvider> | Observable<FileProvider> | FileProvider;

  removeProvider(
    request: RegisterProviderRequest,
  ): Promise<FileProvider> | Observable<FileProvider> | FileProvider;
}

export function FileProviderFileServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['registerProvider', 'removeProvider'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('FileProviderFileService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('FileProviderFileService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const FILE_PROVIDER_FILE_SERVICE_NAME = 'FileProviderFileService';
