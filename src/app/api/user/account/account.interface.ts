import {Document} from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  pictureUrl?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  passwordToken?: string;
}

export interface IUserDocument extends IUser, Document {
  verifyPassword(password: string): Promise<boolean>;
}
