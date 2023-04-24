import {Router} from 'express';
import {adminValidators} from './admin.validators';
import {adminController} from './admin.controller';
import {extractClientDetails} from 'src/app/middlewares/client-details';
import {session} from 'src/app/middlewares/session';
import {UserType} from 'src/app/constants/user.constants';
import {categoryRoutes} from './categories/categories.routes';
import {productRoutes} from './products/products.routes';

const router: Router = Router();

router.post('/login', adminValidators.login, extractClientDetails, adminController.login);
const secureRouter: Router = Router();
router.use(session([UserType.SUPER_ADMIN]), secureRouter);

secureRouter.use(categoryRoutes.path, categoryRoutes.categoryRouter);
secureRouter.use(productRoutes.path, productRoutes.productRouter);

export const adminRoutes = router;
