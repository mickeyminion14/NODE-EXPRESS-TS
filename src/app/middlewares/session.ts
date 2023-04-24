import {NextFunction, Request, Response} from 'express';
import {AUTHORIZATION} from '../constants/message.constants';
import {AUTH_TYPES} from '../constants/session.constants';
import {verify} from 'jsonwebtoken';
import {UserType} from '../constants/user.constants';
import {ResponseError} from '../utils/error.util';
import {User} from './api';

const config = require('config');
const BASIC_TOKEN = Buffer.from(`sarthak:sarthak`).toString('base64');

export function session(users: UserType[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;

    if (!authorization) {
      return next(new ResponseError(400, AUTHORIZATION.REQUIRED));
    }
    const [type, token] = authorization.split(' ');
    if (!type || !token || !Object.values(AUTH_TYPES).includes(type)) {
      return next(new ResponseError(400, AUTHORIZATION.INVALID_MEHTOD));
    }
    if (type === AUTH_TYPES.BASIC && token === BASIC_TOKEN) {
      if (!users.length) {
        return next();
      }
      return next(new ResponseError(401, AUTHORIZATION.NO_ACCESS));
    } else if (type === AUTH_TYPES.BEARER) {
      try {
        const verifiedUser = users.reduce((result: User | null, userType: UserType) => {
          if (result) {
            return result;
          }
          try {
            const secret = config.secrets[userType].authToken;

            let user = verify(token, secret, {});
            return result || (user as User);
          } catch (err: any) {
            if (err.name === 'JsonWebTokenError') {
              return null;
            }
            throw err;
          }
        }, null);
        if (!verifiedUser) {
          return next(new ResponseError(401, AUTHORIZATION.NO_ACCESS));
        }
        req.user = verifiedUser;
        return next();
      } catch ({name, message}: any) {
        return next(new ResponseError(401, message as string));
      }
    }

    return next(new ResponseError(401, AUTHORIZATION.INVALID));
  };
}
