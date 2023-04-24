import {ResponseError} from 'src/app/utils/error.util';
import {CATEGORIES_MESSAGES, CATEGORIES_STATUS} from './categories.constant';
import {ICategory} from './categories.interface';
import {CategoryModel} from './categories.model';
import {IListData} from '../../api.interface';
import {API_MESSAGES} from '../../api.constants';
import {DAO} from 'src/app/database/mongo/dao-manager';
import {serverLogger} from 'src/app/utils/logger';
import {PipelineStage} from 'mongoose';

class CategoriesService {
  async addCategory(payload: ICategory) {
    serverLogger.info(payload);
    try {
      const {modifiedCount, upsertedId} = await CategoryModel.updateOne(
        {categoryName: payload.categoryName},
        {
          $set: {},
          $setOnInsert: {
            ...payload,
            count: 0,
            status: CATEGORIES_STATUS.ACTIVE
          }
        },
        {
          upsert: true
        }
      );
      if (modifiedCount) {
        return Promise.reject(new ResponseError(400, CATEGORIES_MESSAGES.ALREADY_EXISTS));
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
        $nor: [
          {status: CATEGORIES_STATUS.DELETED}
          //  {status: CATEGORIES_STATUS.BLOCKED}
        ]
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

    return await DAO.paginate(matchPipeline1, {pageIndex, pageSize}, pipeline).aggregate(CategoryModel);
  }

  async delete(categoryId: string) {
    return await CategoryModel.updateOne(
      {
        _id: categoryId,
        status: {
          $ne: CATEGORIES_STATUS.DELETED
        }
      },
      {
        status: CATEGORIES_STATUS.DELETED
      }
    );
  }

  async blockUnblock(categoryId: string, status: CATEGORIES_STATUS) {
    return await CategoryModel.updateOne(
      {
        _id: categoryId,
        status: {
          $ne: CATEGORIES_STATUS.DELETED
        }
      },
      {
        status: status == CATEGORIES_STATUS.BLOCKED ? CATEGORIES_STATUS.ACTIVE : CATEGORIES_STATUS.BLOCKED
      }
    );
  }

  async edit(payload: any) {
    return await CategoryModel.updateOne(
      {
        _id: payload._id
      },
      {
        categoryName: payload.categoryName
      }
    );
  }

  async getAllCategories() {
    const pipeline = {
      _id: 1,
      categoryName: 1
    };

    return await CategoryModel.find({status: CATEGORIES_STATUS.ACTIVE}, pipeline);
  }
}

export const categoriesService = new CategoriesService();
