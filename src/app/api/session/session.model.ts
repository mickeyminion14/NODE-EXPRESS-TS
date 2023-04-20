import {Schema, Model, model, Types} from 'mongoose';
import {ISessionDocument} from './session.interface';
import {UserType} from '../../constants/user.constants';

const sessionSchema = new Schema(
  {
    client: {
      agent: String,
      ipAddr: String,
      proxy: String
    },
    isActive: {
      default: true,
      required: true,
      type: Boolean
    },
    userId: {
      required: true,
      type: Types.ObjectId
    },
    type: {
      enum: Object.values(UserType),
      required: true,
      type: String
    },
    token: String,
    socketId: String,
    // tslint:disable-next-line: object-literal-sort-keys
    createdAt: Date,
    updatedAt: Date
  },
  {
    collection: 'sessions',
    timestamps: true
  }
);

export const SessionModel = model<ISessionDocument>('sessions', sessionSchema);
