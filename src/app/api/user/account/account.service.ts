import {sessionService} from '../../session/session.service';
import {UserModel} from './account.model';
import {IUserDocument, IUser} from './account.interface';
import {IClient} from '../../session/session.interface';
import {UserType} from '../../../constants/user.constants';
import {ACCOUNT_MESSAGES, TokenStatus, USER_STATUS} from './account.constants';
import {SessionModel} from '../../session/session.model';

import {API_MESSAGES} from '../../api.constants';
import {ResponseError} from 'src/app/utils/error.util';
import {passwordUtil} from 'src/app/utils/password.util';
import {tokenUtil} from 'src/app/utils/jwt.util';
import {serverLogger} from 'src/app/utils/logger';

class UserService {
  /**
   * @description A function to create sesssion of user by given email and password
   * @param {string} email Admin email
   * @param {string} password Admin password
   */
  async createSession(email: string, password: string, client: IClient): Promise<any> {
    const user = await UserModel.findOne<IUserDocument>({email});
    if (!user) {
      return Promise.reject(new ResponseError(401, ACCOUNT_MESSAGES.LOGIN.NOT_FOUND, 4011));
    }
    if (!(await user.verifyPassword(password))) {
      return Promise.reject(new ResponseError(401, ACCOUNT_MESSAGES.LOGIN.INVALID, 4012));
    }
    const token = await sessionService.create(client, {
      userId: user._id,
      type: UserType.USER
    });
    return {
      token,
      profile: {
        ...user.toObject(),
        password: undefined,
        passwordToken: undefined
      }
    };
  }

  async createAccount(email: string, password: string, fullName: string) {
    try {
      const payload = {email, password, fullName};
      serverLogger.warning(JSON.stringify(payload));
      const {modifiedCount, upsertedId} = await UserModel.updateOne(
        {email: email},
        {
          $set: {},
          $setOnInsert: {
            ...payload,
            status: USER_STATUS.ACTIVE
          }
        },
        {upsert: true}
      );
      if (modifiedCount) {
        return Promise.reject(new ResponseError(400, ACCOUNT_MESSAGES.SIGNUP.ALREADY_EXISTS));
      }
      return upsertedId ? upsertedId : null;
    } catch (err: any) {
      let message = err.message;
      if (err.name === 'MongoError') {
        message = API_MESSAGES.INTERNAL;
      }
      return Promise.reject(new ResponseError(400, message));
    }
  }
  /**
   * @description A function to fetch user details by given id
   * @param {string} id Admin document ObjectId
   */
  async details(id: string): Promise<IUser | null> {
    return await UserModel.findById(id, {password: 0}).lean().exec();
  }
  /**
   * @description A function to update user details
   * @param {string} id Admin document ObjectId
   */
  async update(id: string, payload: any): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(id, payload, {
      new: true,
      projection: {
        password: false
      }
    });
    if (!user) {
      return Promise.reject(new ResponseError(400, ACCOUNT_MESSAGES.UPDATE.NOT_FOUND));
    }
    return user.toObject();
  }
  // async forgetPassword(email: string) {
  //   Console.info(email);
  //   const token: string = tokenUtil.generatePwdMailToken(
  //     { email },
  //     UserType.USER
  //   );
  //   const user = await UserModel.findOneAndUpdate(
  //     { email },
  //     {
  //       $set: {
  //         passwordToken: token,
  //       },
  //     },
  //     {
  //       projection: { name: true },
  //     }
  //   );

  //   if (!user) {
  //     return Promise.reject(
  //       new ResponseError(400, ADMIN_MESSAGES.FORGOT_PASSWORD.NOT_FOUND)
  //     );
  //   } else {
  //     mailer
  //       .sendMail(App.MailType.ForgotPassword, email, {
  //         name: user.name,
  //         url: environment.url + "/v1/admins/verify-forget/" + token,
  //       })
  //       .then(() => {
  //         Console.info("Mail Sent");
  //       })
  //       .catch((err: any) => {
  //         Console.error(JSON.stringify(err));
  //       });
  //   }
  // }
  async verifyForgetPasswordToken(token: string): Promise<TokenStatus> {
    try {
      tokenUtil.verifyPwdMailToken(token, UserType.USER);
      const isExists = await UserModel.exists({passwordToken: token});
      if (!isExists) {
        return TokenStatus.Invalid;
      }
      return TokenStatus.Active;
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError') {
        return TokenStatus.Active;
      } else if (err.name === 'TokenExpiredError') {
        return TokenStatus.Expired;
      }
      return Promise.reject(err);
    }
  }
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      tokenUtil.verifyPwdMailToken(token, UserType.USER);
      const doc = {password, isModified: (el: string) => true};
      await passwordUtil.hook.call(doc as any);
      const user = await UserModel.findOneAndUpdate(
        {passwordToken: token},
        {
          $set: {password: doc.password},
          $unset: {
            passwordToken: ''
          }
        }
      );
      if (!user) {
        return Promise.reject(new ResponseError(400, ACCOUNT_MESSAGES.RESET_PASSWORD.NOT_FOUND));
      }
      // @TODO remove all sessions
      await SessionModel.updateOne(
        {
          userId: user._id,
          isActive: true
        },
        {$set: {isActive: false}}
      );
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError') {
        return Promise.reject(new ResponseError(400, ACCOUNT_MESSAGES.RESET_PASSWORD.INVALID_TOKEN));
      } else if (err.name === 'TokenExpiredError') {
        return Promise.reject(new ResponseError(400, ACCOUNT_MESSAGES.RESET_PASSWORD.TOKEN_EXPIRED));
      }
      return Promise.reject(err);
    }
  }
}

export const userService = new UserService();
