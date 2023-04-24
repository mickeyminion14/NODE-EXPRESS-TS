import {Document} from 'mongoose';

export interface ICategory {
  categoryName: string;
}

export interface ICategoryDocument extends ICategory, Document {}
