import {Router} from 'express';
import {productsController} from './products.controller';
import {productValidators} from './products.validator';
import {UserType} from 'src/app/constants/user.constants';
import {session} from 'src/app/middlewares/session';

const productRouter: Router = Router();

productRouter
  .route('/')
  .post(productValidators.add, productsController.add)
  .get(productValidators.list, productsController.list);

productRouter.route('/updateInStock').patch(productValidators.toogleInStock, productsController.toogleInStock);

// productRouter.use(session([UserType.SUPER_ADMIN]), productRouter);

export const productRoutes = {path: '/products', productRouter};
