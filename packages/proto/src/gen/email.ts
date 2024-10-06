// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v5.28.2
// source: email.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EmailSenderIdentifier, ProjectIdentifier } from './identifiers';

export const protobufPackage = 'juno.email';

export interface EmailSender {
  username: string;
  description?: string | undefined;
  projects: ProjectIdentifier[];
  domain: string;
}

export interface SendEmailRequest {
  recipients: EmailRecipient[];
  cc: EmailRecipient[];
  bcc: EmailRecipient[];
  sender: SenderInfo | undefined;
  content: EmailContent[];
}

export interface SenderInfo {
  email: string;
  name: string;
}

export interface SendEmailResponse {
  statusCode: number;
}

export interface EmailRecipient {
  email: string;
  name?: string | undefined;
}

export interface EmailContent {
  type: string;
  value: string;
}

export interface CreateEmailSenderRequest {
  username: string;
  configId: number;
  description?: string | undefined;
  domain: string;
}

export interface EmailUpdateParams {
  description?: string | undefined;
}

export interface UpdateEmailSenderRequest {
  emailSenderIdentifier: EmailSenderIdentifier | undefined;
  updateParams: EmailUpdateParams | undefined;
}

export interface DeleteEmailSenderRequest {
  emailSenderIdentifier: EmailSenderIdentifier | undefined;
  configId: number;
}

export interface SendEmailSenderRequestResponse {
  success: boolean;
}

export interface RegisterSenderRequest {
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

export interface RegisterSenderResponse {
  statusCode: number;
  message: string;
}

export interface AuthenticateDomainRequest {
  domain: string;
  subdomain?: string | undefined;
  configId: number;
}

export interface AuthenticateDomainResponse {
  id: number;
  valid: string;
  records: SendGridDnsRecords | undefined;
  statusCode: number;
}

export interface SendGridDnsRecords {
  mailCname: SendGridRecord | undefined;
  dkim1: SendGridRecord | undefined;
  dkim2: SendGridRecord | undefined;
}

export interface SendGridRecord {
  valid: boolean;
  type: string;
  host: string;
  data: string;
}

export interface EmailDomain {
  domain: string;
  subdomain: string;
  sendgridId: number;
  projects: ProjectIdentifier[];
}

export interface EmailDomainRequest {
  domain: string;
}

export interface CreateEmailDomainRequest {
  domain: string;
  subdomain: string;
  sendgridId: number;
  configId: number;
}

export interface VerifyDomainRequest {
  domain: string;
}

export interface VerifyDomainResponse {
  id: number;
  valid: boolean;
  records: SendGridDnsRecords | undefined;
  statusCode: number;
}

export const JUNO_EMAIL_PACKAGE_NAME = 'juno.email';

export interface EmailServiceClient {
  sendEmail(request: SendEmailRequest): Observable<SendEmailResponse>;

  registerSender(
    request: RegisterSenderRequest,
  ): Observable<RegisterSenderResponse>;

  authenticateDomain(
    request: AuthenticateDomainRequest,
  ): Observable<AuthenticateDomainResponse>;

  verifyDomain(request: VerifyDomainRequest): Observable<VerifyDomainResponse>;
}

export interface EmailServiceController {
  sendEmail(
    request: SendEmailRequest,
  ):
    | Promise<SendEmailResponse>
    | Observable<SendEmailResponse>
    | SendEmailResponse;

  registerSender(
    request: RegisterSenderRequest,
  ):
    | Promise<RegisterSenderResponse>
    | Observable<RegisterSenderResponse>
    | RegisterSenderResponse;

  authenticateDomain(
    request: AuthenticateDomainRequest,
  ):
    | Promise<AuthenticateDomainResponse>
    | Observable<AuthenticateDomainResponse>
    | AuthenticateDomainResponse;

  verifyDomain(
    request: VerifyDomainRequest,
  ):
    | Promise<VerifyDomainResponse>
    | Observable<VerifyDomainResponse>
    | VerifyDomainResponse;
}

export function EmailServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'sendEmail',
      'registerSender',
      'authenticateDomain',
      'verifyDomain',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('EmailService', method)(
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
      GrpcStreamMethod('EmailService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const EMAIL_SERVICE_NAME = 'EmailService';

export interface EmailDbServiceClient {
  getEmailSender(request: EmailSenderIdentifier): Observable<EmailSender>;

  createEmailSender(request: CreateEmailSenderRequest): Observable<EmailSender>;

  updateEmailSender(request: UpdateEmailSenderRequest): Observable<EmailSender>;

  deleteEmailSender(request: DeleteEmailSenderRequest): Observable<EmailSender>;

  getEmailDomain(request: EmailDomainRequest): Observable<EmailDomain>;

  createEmailDomain(request: CreateEmailDomainRequest): Observable<EmailDomain>;
}

export interface EmailDbServiceController {
  getEmailSender(
    request: EmailSenderIdentifier,
  ): Promise<EmailSender> | Observable<EmailSender> | EmailSender;

  createEmailSender(
    request: CreateEmailSenderRequest,
  ): Promise<EmailSender> | Observable<EmailSender> | EmailSender;

  updateEmailSender(
    request: UpdateEmailSenderRequest,
  ): Promise<EmailSender> | Observable<EmailSender> | EmailSender;

  deleteEmailSender(
    request: DeleteEmailSenderRequest,
  ): Promise<EmailSender> | Observable<EmailSender> | EmailSender;

  getEmailDomain(
    request: EmailDomainRequest,
  ): Promise<EmailDomain> | Observable<EmailDomain> | EmailDomain;

  createEmailDomain(
    request: CreateEmailDomainRequest,
  ): Promise<EmailDomain> | Observable<EmailDomain> | EmailDomain;
}

export function EmailDbServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getEmailSender',
      'createEmailSender',
      'updateEmailSender',
      'deleteEmailSender',
      'getEmailDomain',
      'createEmailDomain',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('EmailDbService', method)(
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
      GrpcStreamMethod('EmailDbService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const EMAIL_DB_SERVICE_NAME = 'EmailDbService';
