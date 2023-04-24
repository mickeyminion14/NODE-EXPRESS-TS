import {Router} from 'express';
import {accountController} from './account.ctrl';

import {userValidators} from './account.validators';
import {extractClientDetails} from 'src/app/middlewares/client-details';
import {session} from 'src/app/middlewares/session';
import {UserType} from 'src/app/constants/user.constants';

const accountRouter: Router = Router();

accountRouter.post('/login', userValidators.login, extractClientDetails, accountController.login);

accountRouter.post('/signup', userValidators.signup, extractClientDetails, accountController.signup);

const secureRouter: Router = Router();
secureRouter.route('/profile').get(accountController.profile).patch(userValidators.profile, accountController.update);

accountRouter.use(session([UserType.USER]), secureRouter);

export const accountRoutes = {path: '/account', accountRouter};
