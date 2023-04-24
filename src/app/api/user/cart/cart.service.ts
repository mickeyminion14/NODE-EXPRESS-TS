import {PipelineStage, Types} from 'mongoose';
import {ProductModel} from '../../admin/products/products.model';
import {MESSAGES} from './cart.constants';
import {CartModel} from './cart.model';
import {ResponseError} from 'src/app/utils/error.util';

class CartService {
  //@ts-ignore
  async addToCart(userId: string, productId: string) {
    try {
      const product = await ProductModel.findOne({
        _id: new Types.ObjectId(productId)
      });
      const aggrPipline: PipelineStage[] = [
        {
          $unwind: {
            path: '$items'
          }
        },

        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'items.product'
          }
        },

        {
          $unwind: {
            path: '$items.product'
          }
        },
        {
          $project: {
            _v: -1,
            items: {
              productId: 1,
              quantity: 1,
              product: 1,
              subTotal: {
                $multiply: ['$items.quantity', '$items.product.price']
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            items: {$push: {items: '$items'}}
          }
        },
        {
          $addFields: {
            items: '$items.items',
            _id: '$_id._id',
            total: {
              $sum: ['$items.items.subTotal']
            },
            totalItems: {
              $size: '$items'
            }
          }
        }
      ];

      //product exists in db
      if (product) {
        const cart = await CartModel.findOne({userId});
        // cart already exists
        if (cart) {
          const {items} = cart;
          const itemIndex = items.findIndex(
            (item) => item.productId.toString() === productId //convert objectid to normal string
          );
          // product already exists
          if (itemIndex > -1) {
            let productItem = items[itemIndex];
            productItem.quantity += 1;
            items[itemIndex] = productItem;
          }
          // product does not exist already
          else {
            items.push({
              productId: new Types.ObjectId(productId),
              quantity: 1
            });
            console.log(items);
          }
          await CartModel.findOneAndUpdate(
            {userId},
            {
              $set: {
                items: [...items]
              }
            },
            {lean: true, new: true}
          );

          return CartModel.aggregate(aggrPipline);
        }

        //create new cart
        else {
          const newPayload = {
            userId,
            items: [{productId: new Types.ObjectId(productId), quantity: 1}]
          };
          await CartModel.findOneAndUpdate(
            {userId},
            {
              $set: {},
              $setOnInsert: {
                ...newPayload
              }
            },
            {lean: true, upsert: true, new: true}
          );

          return CartModel.aggregate(aggrPipline);
        }
      }
      //product not found
      else {
        return Promise.reject(new ResponseError(401, MESSAGES.PRODUCT_NOT_FOUND));
      }
    } catch (error: any) {
      let message = error.message;
    }
  }
}

export const cartService = new CartService();
