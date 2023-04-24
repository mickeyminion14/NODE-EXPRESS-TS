import {Schema, Model, model} from 'mongoose';
import {ICategoryDocument} from './categories.interface';

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true
    },
    count: {
      type: Number
    },
    status: {
      type: Number
    }
  },
  {
    timestamps: true,
    collection: 'categories'
  }
);

export const CategoryModel = model<ICategoryDocument>('category', CategorySchema);
