// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v5.28.2
// source: file.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "juno.file_service.file";

export interface File {
  bucketName: string;
  configId: number;
  filePath: string;
  metadata: string;
}

export interface GetFileRequest {
  bucketName: string;
  configId: number;
  filePath: string;
}

export interface CreateFileRequest {
  bucketName: string;
  configId: number;
  filePath: string;
  metadata: string;
}

export interface UpdateFileRequest {
  bucketName: string;
  configId: number;
  filePath: string;
  metadata: string;
}

export interface DeleteFileRequest {
  bucketName: string;
  configId: number;
  filePath: string;
}

export const JUNO_FILE_SERVICE_FILE_PACKAGE_NAME = "juno.file_service.file";

export interface FileDbServiceClient {
  getFile(request: GetFileRequest): Observable<File>;

  createFile(request: CreateFileRequest): Observable<File>;

  deleteFile(request: DeleteFileRequest): Observable<File>;

  updateFile(request: UpdateFileRequest): Observable<File>;
}

export interface FileDbServiceController {
  getFile(request: GetFileRequest): Promise<File> | Observable<File> | File;

  createFile(request: CreateFileRequest): Promise<File> | Observable<File> | File;

  deleteFile(request: DeleteFileRequest): Promise<File> | Observable<File> | File;

  updateFile(request: UpdateFileRequest): Promise<File> | Observable<File> | File;
}

export function FileDbServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getFile", "createFile", "deleteFile", "updateFile"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("FileDbService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("FileDbService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const FILE_DB_SERVICE_NAME = "FileDbService";
