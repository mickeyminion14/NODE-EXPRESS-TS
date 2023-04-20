import {Router} from 'express';
import {userRoutes} from './user/user.routes';
import './api.swagger';
import {adminRoutes} from './admin/admin.routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

export const apiRouter = router;
