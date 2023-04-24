import {Router} from 'express';
import {userController} from './user.controller';
import {productRoutes} from './products/products.routes';
import {cartRoutes} from './cart/cart.routes';
import {accountRoutes} from './account/account.routes';

const userRouter: Router = Router();

userRouter.use(productRoutes.path, productRoutes.productRouter);
userRouter.use(cartRoutes.path, cartRoutes.cartRouter);
userRouter.use(accountRoutes.path, accountRoutes.accountRouter);

// userRouter.route('/').get(userController.getUsers).post(userController.registerUser);
export const userRoutes = userRouter;
