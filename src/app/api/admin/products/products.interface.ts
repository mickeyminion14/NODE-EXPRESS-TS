import {Document} from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  isPremium: boolean;
  // inStockQuantity: number;
  images: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends Document, IProduct {}
