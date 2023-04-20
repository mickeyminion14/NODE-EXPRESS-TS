import {NextFunction, Request, Response} from 'express';
import {ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant} from 'swagger-express-ts';
import {usersService} from './user.service';
import {serverLogger} from 'src/app/utils/logger';

@ApiPath({
  path: '/users',
  name: 'Users'
})
class UserController {
  @ApiOperationGet({
    description: 'Get all user',
    summary: 'Get all user',
    responses: {
      200: {
        description: 'Success',
        type: 'String'
      }
    }
  })
  async getUsers(req: Request, res: Response, next: NextFunction) {
    usersService
      .getUsers()
      .then((data) => {
        res.success('Happy', data);
      })
      .catch((err) => next());
  }

  @ApiOperationPost({
    description: 'Register User',
    summary: 'Register User',
    parameters: {
      body: {
        description: 'User Register Data',
        required: true,
        model: 'RegisterDataModel'
      }
    },
    responses: {
      200: {
        description: 'Success',
        type: 'String'
      }
    }
  })
  async registerUser(req: Request, res: Response, next: NextFunction) {
    const payload = req.body;
    serverLogger.info(payload);
    usersService
      .registerUser(payload)
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(400).json({message: 'Error'}));
  }
}

export const userController = new UserController();
