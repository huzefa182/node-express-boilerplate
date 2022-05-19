import { Router } from 'express';

import authRoutes from './auth';
import publicRoutes from './master';
import studentRoutes from './student';
import collegeRoutes from './college';
import planRoutes from './plan';
import featureRoutes from './feature';

const router = Router();

router.use('/', publicRoutes);
router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/college', collegeRoutes);
router.use('/plan', planRoutes);
router.use('/feature', featureRoutes);

export default router;