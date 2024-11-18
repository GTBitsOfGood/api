// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v5.28.2
// source: project.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ProjectIdentifier, UserIdentifier } from './identifiers';

export const protobufPackage = 'juno.project';

export interface Project {
  id: number;
  name: string;
}

export interface CreateProjectRequest {
  name: string;
}

export interface ProjectUpdateParams {
  name?: string | undefined;
}

export interface LinkUserToProjectRequest {
  project: ProjectIdentifier | undefined;
  user: UserIdentifier | undefined;
}

export interface UpdateProjectRequest {
  projectIdentifier: ProjectIdentifier | undefined;
  updateParams: ProjectUpdateParams | undefined;
}

export const JUNO_PROJECT_PACKAGE_NAME = 'juno.project';

export interface ProjectServiceClient {
  getProject(request: ProjectIdentifier): Observable<Project>;

  createProject(request: CreateProjectRequest): Observable<Project>;

  updateProject(request: UpdateProjectRequest): Observable<Project>;

  deleteProject(request: ProjectIdentifier): Observable<Project>;

  linkUser(request: LinkUserToProjectRequest): Observable<Project>;
}

export interface ProjectServiceController {
  getProject(
    request: ProjectIdentifier,
  ): Promise<Project> | Observable<Project> | Project;

  createProject(
    request: CreateProjectRequest,
  ): Promise<Project> | Observable<Project> | Project;

  updateProject(
    request: UpdateProjectRequest,
  ): Promise<Project> | Observable<Project> | Project;

  deleteProject(
    request: ProjectIdentifier,
  ): Promise<Project> | Observable<Project> | Project;

  linkUser(
    request: LinkUserToProjectRequest,
  ): Promise<Project> | Observable<Project> | Project;
}

export function ProjectServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getProject',
      'createProject',
      'updateProject',
      'deleteProject',
      'linkUser',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('ProjectService', method)(
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
      GrpcStreamMethod('ProjectService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const PROJECT_SERVICE_NAME = 'ProjectService';
