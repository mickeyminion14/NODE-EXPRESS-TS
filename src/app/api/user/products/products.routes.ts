import {Router} from 'express';
import {productsController} from './products.controller';
import {productValidators} from './products.validator';

const productRouter: Router = Router();

productRouter.route('/').get(productValidators.list, productsController.list);
productRouter.route('/latestProducts').get(productValidators.latestProducts, productsController.latestProducts);

productRouter.route('/:productId').get(productValidators.productDetails, productsController.productDetails);

export const productRoutes = {path: '/products', productRouter};
