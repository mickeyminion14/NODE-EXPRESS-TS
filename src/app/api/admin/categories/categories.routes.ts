import {Router} from 'express';
import {categoriesController} from './categories.controller';
import {categoryValidators} from './categories.validator';

const categoryRouter: Router = Router();

categoryRouter
  .route('/')
  .post(categoryValidators.add, categoriesController.add)
  .get(categoryValidators.list, categoriesController.list)
  .patch(categoryValidators.delete, categoriesController.delete)
  .put(categoryValidators.edit, categoriesController.edit);
categoryRouter.route('/all').get(categoriesController.getAllCategories);
categoryRouter.route('/blockUnblock').patch(categoryValidators.blockUnblock, categoriesController.blockUnblock);
// categoryRouter.use(session([UserType.SUPER_ADMIN]), categoryRouter);

export const categoryRoutes = {path: '/categories', categoryRouter};
