import {NextFunction, Request, Response} from 'express';
import {CATEGORIES_MESSAGES, CATEGORIES_STATUS} from './categories.constant';
import {categoriesService} from './categories.service';
import {IListData} from '../../api.interface';

class CategoriesController {
  add(req: Request, res: Response, next: NextFunction): void {
    categoriesService
      .addCategory(req.data)
      .then((result): void => {
        res.success(CATEGORIES_MESSAGES.ADD_SUCCESS, result);
      })
      .catch(next);
  }

  /**
   * @description A function to handle categories list request
   * @param req Express request
   * @param res Express response
   */
  list(req: Request, res: Response, next: NextFunction) {
    categoriesService
      .list(req.data)
      .then((result: IListData) => {
        res.success(CATEGORIES_MESSAGES.LIST, result);
      })
      .catch(next);
  }

  delete(req: Request, res: Response, next: NextFunction) {
    categoriesService
      .delete(req.data.categoryId)
      .then((result) => {
        res.success(CATEGORIES_MESSAGES.DELETE_SUCCESS, result);
      })
      .catch(next);
  }

  edit(req: Request, res: Response, next: NextFunction) {
    categoriesService
      .edit(req.data)
      .then((result) => {
        res.success(CATEGORIES_MESSAGES.UPDATE_SUCCESS, result);
      })
      .catch(next);
  }

  blockUnblock(req: Request, res: Response, next: NextFunction) {
    categoriesService
      .blockUnblock(req.data.categoryId, req.data.status)
      .then((result) => {
        res.success(
          `Category ${req.data.status == CATEGORIES_STATUS.BLOCKED ? 'unblocked' : 'blocked'} successfully`,
          result
        );
      })
      .catch(next);
  }

  getAllCategories(req: Request, res: Response, next: NextFunction) {
    categoriesService
      .getAllCategories()
      .then((result) => {
        res.success('', result);
      })
      .catch(next);
  }
}

export const categoriesController = new CategoriesController();
