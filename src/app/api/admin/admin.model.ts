import {Schema, Model, model} from 'mongoose';
import {IAdminDocument} from './admin.interface';
import {passwordUtil} from 'src/app/utils/password.util';

const AdminSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      required: true,
      type: String
    },
    password: {
      required: true,
      type: String
    },
    passwordToken: String,
    photoUrl: {
      type: String
    },
    createdAt: Date,
    updatedAt: Date
  },
  {
    collection: 'admins',
    timestamps: true
  }
);
AdminSchema.methods.verifyPassword = passwordUtil.verify;

AdminSchema.pre('save', function (this: IAdminDocument, next: any) {
  // Call Password Hook
  passwordUtil.hook.call(this).then(next).catch(next);
  // Do other tasks
});

AdminSchema.pre('findOneAndUpdate', function (this: IAdminDocument, next: any) {
  // Call Password Hook
  passwordUtil.hook.call(this).then(next).catch(next);
  // Do other tasks
});

export const AdminModel = model<IAdminDocument>('admins', AdminSchema);
