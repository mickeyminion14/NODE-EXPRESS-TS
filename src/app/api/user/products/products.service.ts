import {PipelineStage, Types} from 'mongoose';
import {PRODUCTS_STATUS} from '../../admin/products/products.constant';
import {ProductModel} from '../../admin/products/products.model';
import {IListData} from '../../api.interface';
import {DAO} from 'src/app/database/mongo/dao-manager';

class ProductsService {
  async list(options: IListData) {
    const {pageIndex, pageSize, sort_by = 'createdAt', sort_order = 'desc', searchText} = options;
    // stages before pagination
    const match: PipelineStage = {
      $match: {
        status: {
          $ne: PRODUCTS_STATUS.DELETED
        }
      }
    };
    const matchPipeline: PipelineStage[] = [
      match,
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

    return await DAO.paginate(matchPipeline, {pageIndex, pageSize}, pipeline).aggregate(ProductModel);
  }

  async latestProducts(options: IListData) {
    const {pageIndex, pageSize, sort_by = 'createdAt', sort_order = 'desc', searchText} = options;
    // stages before pagination
    const $match: PipelineStage = {
      $match: {
        status: {
          $ne: PRODUCTS_STATUS.DELETED
        }
      }
    };
    const matchPipeline: PipelineStage[] = [
      $match,
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

    return await DAO.paginate(matchPipeline, {pageIndex, pageSize}, pipeline).aggregate(ProductModel);
  }

  async productDetails(productId: string) {
    return await ProductModel.findOne({_id: new Types.ObjectId(productId)})
      .lean()
      .exec();
  }
}

export const productsService = new ProductsService();
