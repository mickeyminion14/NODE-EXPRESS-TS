import {Document} from 'mongoose';

export interface ICart {
  items: Array<any>;
  userId: string;
  totalPrice: number;
  //   totalPrice:number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
export interface ICartDocument extends Document, ICart {}
