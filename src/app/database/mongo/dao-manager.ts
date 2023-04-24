import {Document, Model, PipelineStage, Types} from 'mongoose';
import {IAdminDocument} from 'src/app/api/admin/admin.interface';
import {PaginateOptions} from 'src/app/api/api.interface';

/**
 * @class DaoManager
 * @description A class to access database server
 */
class DaoManager {
  // constructor() { }
  /**
   * @class DaoManager
   * @description A function to save a document to database collection
   * @param DocumentModel A database model
   * @param data Document data to be saved
   */
  async save<T extends Document>(DocumentModel: Model<T>, data: any): Promise<T> {
    const document = new DocumentModel(data);
    return document.save();
  }
  /**
   * @class DaoManager
   * @description A function to store multiple documents to database collection
   * @param DocumentModel A database model
   * @param data Documents data to be saved
   */
  async store<T extends Document>(DocumentModel: Model<T>, data: any[]): Promise<T[]> {
    return DocumentModel.insertMany(data);
  }

  async findOne<T extends Document>(
    DocumentModel: Model<T>,
    query: object,
    projections: {[key: string]: 1 | 0} = {},
    options?: any
  ): Promise<T | null> {
    return await DocumentModel.findOne(query, projections, options).exec();
  }
  findMany<T extends Document>(
    DocumentModel: Model<T>,
    query: object,
    projections: {[key: string]: 1 | 0} = {},
    options?: any
  ) {
    return DocumentModel.find(query, projections, options);
  }
  async findIdList<T extends Document>(DocumentModel: Model<T>, query: object): Promise<string[]> {
    const result: Array<{_id: Types.ObjectId}> = await DocumentModel.find(query).select({_id: 1}).lean().exec();
    if (!result.length) {
      return [];
    }
    return result.map(({_id}) => _id.toHexString());
  }
  async findId<T extends Document>(DocumentModel: Model<T>, query: object): Promise<string | null> {
    const result = await DocumentModel.findOne(query).select({_id: 1}).exec();
    if (result) {
      return result._id;
    }
    return null;
  }
  findById<T extends Document>(
    DocumentModel: Model<T>,
    id: string,
    projections: {[key: string]: 1 | 0} = {},
    options?: any
  ) {
    return DocumentModel.findById(id, projections, options);
  }
  async exists<T extends Document>(DocumentModel: Model<T>, query: object): Promise<boolean> {
    return !!(await DocumentModel.countDocuments(query).exec());
  }
  async docExists<T extends Document>(DocumentModel: Model<T>, id: string): Promise<boolean> {
    return this.exists<T>(DocumentModel, {
      _id: new Types.ObjectId(id)
    });
  }
  /**
   * @description A function to add stages into pipeline to paginate data
   * @param pipeline pipeline previous stages
   * @param pageIndex pageIndex to skip documents
   * @param pageSize pageSize to limit documents
   * @returns single item array with {pageIndex, pageSize, total, data}
   */
  paginate(matchPipeline: PipelineStage[], options: PaginateOptions, pipeline: PipelineStage[]) {
    const aggrPipeline = [
      ...matchPipeline,
      {
        $facet: {
          data: [{$skip: options.pageIndex * options.pageSize}, {$limit: options.pageSize}, ...pipeline],
          total: [{$count: 'count'}]
        }
      },

      {
        $addFields: {
          pageIndex: options.pageIndex,
          pageSize: options.pageSize,
          total: {
            $let: {
              vars: {
                item: {$arrayElemAt: ['$total', 0]}
              },
              in: '$$item.count'
            }
          }
        }
      }
    ];
    return {
      pipeline: aggrPipeline,
      async aggregate<T extends Document = any>(CollectionModel: Model<T>) {
        const result = await CollectionModel.aggregate(aggrPipeline as PipelineStage[]).exec();
        return {
          ...result[0],
          total: result[0].total || 0
        };
      }
    };
  }
  async signIn(DocumentModel: Model<IAdminDocument>, query: object, password: string): Promise<IAdminDocument | null> {
    const doc = await DocumentModel.findOne(query).exec();
    if (doc && (await doc.verifyPassword(password))) {
      return doc;
    }
    return null;
  }
  async count(DocumentModel: Model<any>, query: object): Promise<number> {
    return DocumentModel.countDocuments(query).exec();
  }
}

export const DAO = new DaoManager();
