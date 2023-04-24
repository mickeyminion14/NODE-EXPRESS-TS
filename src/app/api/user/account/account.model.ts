import {Schema, model} from 'mongoose';
import {IUserDocument} from './account.interface';
import {passwordUtil} from 'src/app/utils/password.util';
import {serverLogger} from 'src/app/utils/logger';

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    status: String,
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
    collection: 'users',
    timestamps: true
  }
);
UserSchema.methods.verifyPassword = passwordUtil.verify;

UserSchema.pre('save', function (this: IUserDocument, next: any) {
  // Call Password Hook
  serverLogger.warn('came');
  passwordUtil.hook.call(this).then(next).catch(next);
  // Do other tasks
});

UserSchema.pre('updateOne', function (this: any, next: any) {
  // Call Password Hook
  console.log(this.getUpdate()['$setOnInsert']);

  passwordUtil.hookUser.call(this).then(next).catch(next);
  // Do other tasks
});

UserSchema.pre('findOneAndUpdate', function (this: IUserDocument, next: any) {
  // Call Password Hook
  passwordUtil.hook.call(this).then(next).catch(next);
  // Do other tasks
});

export const UserModel = model<IUserDocument>('users', UserSchema);
