import {sign, verify, SignOptions, VerifyOptions} from 'jsonwebtoken';
import {ResponseError} from './error.util';
import {UserType} from '../constants/user.constants';
import {SessionModel} from '../api/session/session.model';

const config = require('config');
/**
 * @description A utility class to handle JWT operations
 */
class TokenUtil {
  /**
   * @description A function to generate auth token while logging in.
   * @param payload A payload data which will be stored in jwt.
   * @param userType A user type for which token will be generated (secrets are different for different type of users)
   * @param expiresIn A time in which jwt will be expired
   */
  generateAuthToken(payload: {[key: string]: any}, userType: UserType, expiresIn?: number | string) {
    const authToken = config.secrets[userType].authToken;
    console.log(authToken);

    const options: SignOptions = {};
    if (expiresIn) {
      options.expiresIn = expiresIn;
    }
    return sign(payload, authToken, options);
  }
  /**
   * @description A function to generate token which will be used to send over email to reset password.
   * @param payload A payload data which will be stored in jwt.
   * @param userType A user type for which token will be generated (secrets are different for different type of users)
   * @param expiresIn A time in which jwt will be expired
   */
  generatePwdMailToken(payload: {[key: string]: any}, userType: UserType, expiresIn?: number | string) {
    const {passwordMailToken} = config.secrets[userType.toLowerCase()];
    const options: SignOptions = {};
    if (expiresIn) {
      options.expiresIn = expiresIn;
    }
    return sign(payload, passwordMailToken, options);
  }
  /**
   * @description A method to verify auth token and extract data from it.
   * @param {string} token A token to be verified
   * @param {VerifyOptions} options options used while verifying token.
   */
  verifyAuthToken<T extends object = any>(token: string, userType: UserType, options?: VerifyOptions): string | T {
    const secret = config.secrets[userType].authToken;

    let res = verify(token, secret, options) as string | T;

    return res;
  }
  /**
   * @description A method to verify auth token and extract data from it.
   * @param {string} token A token to be verified
   * @param {VerifyOptions} options options used while verifying token.
   */
  verifyPwdMailToken<T extends object = any>(token: string, userType: UserType, options?: VerifyOptions): string | T {
    const {passwordMailToken} = config.secrets[userType.toLowerCase()];
    return verify(token, passwordMailToken) as string | T;
  }

  async isActive(sessionId: any): Promise<void> {
    const data = await SessionModel.findOne({_id: sessionId});
    if (!data || !data.isActive) {
      return Promise.reject(new ResponseError(400, 'Session expired'));
    }
  }
}

export const tokenUtil = new TokenUtil();
