import {Document, Types} from 'mongoose';
import {UserType} from '../../constants/user.constants';

export interface IClient {
  agent: string;
  proxy: string;
  ipAddr: string;
}

export interface ISessionUser {
  userId: Types.ObjectId;
  type: UserType;
}

export interface ISession {
  user: ISessionUser;
  client: IClient;
  token: string;
  isActive: boolean;
  socketId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionDocument extends ISession, Document {}

export interface ISessionToken {
  authToken: string;
  refreshToken: string;
}
