import {model, Schema} from 'mongoose';
import {ICartDocument} from './cart.interface';

const CartSchema = new Schema(
  {
    userId: String,
    items: {type: Array, default: []},
    totalPrice: Number
  },
  {
    timestamps: true,
    collection: 'cart'
  }
);

export const CartModel = model<ICartDocument>('cart', CartSchema);
