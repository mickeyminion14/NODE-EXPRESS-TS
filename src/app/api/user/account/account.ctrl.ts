import {NextFunction, Request, Response} from 'express';
import {userService} from './account.service';
import {ACCOUNT_MESSAGES} from './account.constants';
import {ResponseError} from 'src/app/utils/error.util';
import {AUTHORIZATION} from 'src/app/constants/message.constants';

class AccountController {
  login(req: Request, res: Response, next: NextFunction): void {
    const {email, password} = req.body;
    userService
      .createSession(email, password, req.client!)
      .then((result: any): void => {
        res.status(200).json({message: ACCOUNT_MESSAGES.LOGIN.SUCCESS, result: result});
      })
      .catch(next);
    // userService.createNewAccount();
  }

  signup(req: Request, res: Response, next: NextFunction): void {
    const {email, password, fullName} = req.body;

    userService
      .createAccount(email, password, fullName)
      .then((result): void => {
        res.success(ACCOUNT_MESSAGES.SIGNUP.SUCCESS, result);
      })
      .catch(next);
  }
  /**
   * @description A function to handle admin profile requests
   * @param {Request} req App request object
   * @param {Response} res App response object
   * @param {NextFunction} res A callback function to call next handler
   */
  profile(req: Request, res: Response, next: NextFunction): void {
    const {userId} = req.user || {userId: null};
    userService
      .details(userId as string)
      .then((result): void => {
        if (result) {
          res.success(ACCOUNT_MESSAGES.PROFILE.SUCCESS, result);
          // res
          //   .status(200)
          //   .json({ message: ACCOUNT_MESSAGES.PROFILE.SUCCESS, result: result });
        } else {
          next(new ResponseError(401, AUTHORIZATION.EXPIRED));
        }
      })
      .catch(next);
  }
  /**
   * @description A function to handle admin update requests
   * @param {Request} req App request object
   * @param {Response} res App response object
   * @param {NextFunction} res A callback function to call next handler
   */
  update(req: Request, res: Response, next: NextFunction): void {
    const {userId} = req.user || {userId: null};
    userService
      .update(userId as string, req.data)
      .then((result): void => {
        res.success(ACCOUNT_MESSAGES.PROFILE.UPDATED, result);
      })
      .catch(next);
  }
}

export const accountController = new AccountController();
