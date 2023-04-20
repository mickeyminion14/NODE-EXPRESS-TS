import {Router} from 'express';
import {adminValidators} from './admin.validators';
import {adminController} from './admin.controller';
import {extractClientDetails} from 'src/app/middlewares/client-details';

const router: Router = Router();

router.post('/login', adminValidators.login, extractClientDetails, adminController.login);

export const adminRoutes = router;
