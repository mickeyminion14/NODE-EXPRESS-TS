import {NextFunction, Request, Response} from 'express';
import {cartService} from './cart.service';
import {CART_MESSAGES} from 'src/app/constants/message.constants';
import {serverLogger} from 'src/app/utils/logger';

class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    res.success('cart fetched', {...req.data});
  }
  async addToCart(req: Request, res: Response, next: NextFunction) {
    serverLogger.warning(req.user);
    const {userId, productId} = req.data;
    cartService
      .addToCart(userId, productId)
      .then((data) => {
        res.success(CART_MESSAGES.ADD_SUCCESS, data);
      })
      .catch(next);
  }
}

export const cartController = new CartController();
