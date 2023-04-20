import {Document} from 'mongoose';

export interface IAdmin {
  email: string;
  password: string;
  pictureUrl?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  passwordToken?: string;
}

export interface IAdminDocument extends IAdmin, Document {
  verifyPassword(password: string): Promise<boolean>;
}
