import {NextFunction, Request, Response} from 'express';
import {PRODUCT_MESSAGES} from './products.constant';
import {IProduct} from './products.interface';
import {productsService} from './products.service';

class ProductsController {
  add(req: Request, res: Response, next: NextFunction): void {
    productsService
      .addProduct(req.data)
      .then((result): void => {
        res.success(PRODUCT_MESSAGES.ADD_SUCCESS, result);
      })
      .catch(next);
  }

  /**
   * @description A function to handle products list request
   * @param req Express request
   * @param res Express response
   */
  list(req: Request, res: Response, next: NextFunction) {
    productsService
      .list(req.data)
      .then((result) => {
        res.success('', result);
      })
      .catch(next);
  }

  toogleInStock(req: Request, res: Response, next: NextFunction) {
    productsService
      .toogleInStock(req.data.id, req.data.inStock)
      .then((result) => {
        res.success('Success', {});
      })
      .catch(next);
  }
}

export const productsController = new ProductsController();
