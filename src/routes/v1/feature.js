import express from 'express';

import FeatureController from '../../controllers/feature.controller';
import FeatureValidator from '../../validators/feature.validator';
import { apiValidate } from '../../middleware/apiValidate';

const router = express.Router();

router.get('/', FeatureController.getFeatures);
router.post('/', apiValidate(FeatureValidator.createFeature), FeatureController.createFeature);

export default router;