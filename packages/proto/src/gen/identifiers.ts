// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v5.27.1
// source: identifiers.proto

/* eslint-disable */

export const protobufPackage = 'juno.identifiers';

export interface ProjectIdentifier {
  id?: number | undefined;
  name?: string | undefined;
}

export interface UserIdentifier {
  id?: number | undefined;
  email?: string | undefined;
}

export interface EmailSenderIdentifier {
  domain: string;
  username: string;
}

export interface ApiKeyIdentifier {
  id?: number | undefined;
  hash?: string | undefined;
}

export const JUNO_IDENTIFIERS_PACKAGE_NAME = 'juno.identifiers';
