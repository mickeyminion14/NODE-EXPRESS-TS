// import * as express from 'express';
// import {ResponseError} from '../utils/error.util';
// import {UserType} from './constants/user.constants';
// import {Types, Document} from 'mongoose';

// export namespace Api {
//   export interface Client {
//     agent: string;
//     ipAddr: string;
//     proxy: string;
//   }
//   export interface User {
//     type: UserType;
//     userId: string | Types.ObjectId;
//     sessionId: string | Types.ObjectId;
//   }
//   export interface Request<T = any> extends express.Request {
//     data?: T;
//     client?: Client;
//     user?: User;
//   }
//   export type SuccessStatus = 200 | 201 | 202 | 204;

//   export interface Response extends express.Response {
//     error(error: ResponseError): void;
//     success(message: string, result?: any, status?: SuccessStatus): void;
//   }

//   export interface Next extends express.NextFunction {}

//   export interface PaginateOptions {
//     pageIndex: number;
//     pageSize: number;
//   }
//   export interface ListOptions extends PaginateOptions {
//     searchText?: string;
//   }
//   export interface PasswordDoc extends Document {
//     password: string;
//   }
// }
