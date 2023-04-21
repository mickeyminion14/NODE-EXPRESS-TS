import {NextFunction, Request, Response} from 'express';
import {adminService} from './admin.service';
import {ADMIN_MESSAGES} from './admin.constants';
import {ApiOperationPost, ApiPath} from 'swagger-express-ts';

@ApiPath({
  path: '/admin/login',
  name: 'Admin'
})
class AdminController {
  @ApiOperationPost({
    description: 'Login Admin',
    summary: 'Login Admin',
    parameters: {
      body: {
        description: 'Admin Login Data',
        required: true,
        model: 'AdminLoginDataModel'
      }
    },
    responses: {
      200: {
        description: 'Success',
        type: 'String'
      }
    }
  })
  login(req: Request, res: Response, next: NextFunction): void {
    const {email, password} = req.body;
    adminService
      .createSession(email, password, req.client)
      .then((result: any): void => {
        res.status(200).json({message: ADMIN_MESSAGES.LOGIN.SUCCESS, result: result});
      })
      .catch(next);
    // adminService
    //   .createNewAdmin()
    //   .then((data) => {
    //     res.success('Admin created', data);
    //   })
    //   .catch(next);
  }
}

export const adminController = new AdminController();
