import {Schema, Model, model} from 'mongoose';
import {IProductDocument} from './products.interface';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: Array,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    inStock: {
      type: Boolean,
      required: true
    },
    isPremium: {
      type: Boolean,
      required: true
    },
    // inStockQuantity: {
    //   type: Number,
    //   required: true,
    // },
    images: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

export const ProductModel = model<IProductDocument>('product', ProductSchema);
