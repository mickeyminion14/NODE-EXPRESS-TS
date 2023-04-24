import {Router} from 'express';
import {cartController} from './cart.controller';
import {cartValidators} from './cart.validator';
import {session} from 'src/app/middlewares/session';
import {UserType} from 'src/app/constants/user.constants';
const cartRouter: Router = Router();
const secureRouter: Router = Router();

// secureRouter.use(extractClientDetails
//   );
secureRouter.route('/').get(cartController.getCart).post(cartValidators.add, cartController.addToCart);
cartRouter.use(session([UserType.USER]), secureRouter);

export const cartRoutes = {path: '/cart', cartRouter};
