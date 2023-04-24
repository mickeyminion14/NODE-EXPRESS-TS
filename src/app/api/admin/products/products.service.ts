import {ResponseError} from 'src/app/utils/error.util';
import {PRODUCTS_STATUS, PRODUCT_MESSAGES} from './products.constant';
import {IProduct} from './products.interface';
import {ProductModel} from './products.model';
import {API_MESSAGES} from '../../api.constants';
import {IListData} from '../../api.interface';
import {PipelineStage} from 'mongoose';
import {DAO} from 'src/app/database/mongo/dao-manager';

class ProductsService {
  async addProduct(payload: IProduct) {
    console.log(payload);

    try {
      const {modifiedCount, upsertedId} = await ProductModel.updateOne(
        {name: payload.name},
        {
          $set: {},
          $setOnInsert: {
            ...payload,
            status: PRODUCTS_STATUS.ACTIVE
          }
        },
        {
          upsert: true
        }
      );
      if (modifiedCount) {
        return Promise.reject(new ResponseError(400, PRODUCT_MESSAGES.ALREADY_EXISTS));
      }
      return upsertedId ? upsertedId : null;
    } catch (err: any) {
      let message = err.message;
      if (err.name === 'MongoError') {
        message = API_MESSAGES.INTERNAL;
      }
      return Promise.reject(new ResponseError(400, message));
    }
  }

  async list(options: IListData) {
    const {pageIndex, pageSize, sort_by = 'createdAt', sort_order = 'desc', searchText} = options;
    // stages before pagination
    const matchPipeline: PipelineStage = {
      $match: {
        status: {
          $ne: PRODUCTS_STATUS.DELETED
        }
      }
    };
    const matchPipeline1: PipelineStage[] = [
      matchPipeline,
      {
        $sort: {
          [sort_by]: sort_order === 'asc' ? 1 : -1
        }
      }
    ];

    // add filters to match stages here
    const pipeline: any = [
      {
        $project: {
          __v: 0
        }
      }
    ];

    return await DAO.paginate(matchPipeline1, {pageIndex, pageSize}, pipeline).aggregate(ProductModel);
  }

  async toogleInStock(id: string, state: boolean) {
    console.log(id, state);

    return await ProductModel.updateOne({_id: id}, {inStock: state});
  }
}

export const productsService = new ProductsService();
