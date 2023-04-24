import {NextFunction, Request, Response} from 'express';
import {productsService} from './products.service';
import {ApiOperationGet, SwaggerDefinitionConstant} from 'swagger-express-ts';

class ProductsController {
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

  latestProducts(req: Request, res: Response, next: NextFunction) {
    productsService
      .latestProducts(req.data)
      .then((result) => {
        res.success('', result);
      })
      .catch(next);
  }

  async productDetails(req: Request, res: Response, next: NextFunction): Promise<any> {
    const {productId} = req.data;
    productsService
      .productDetails(productId)
      .then((result) => {
        res.success('', result);
      })
      .catch(next);
  }
}

export const productsController = new ProductsController();
