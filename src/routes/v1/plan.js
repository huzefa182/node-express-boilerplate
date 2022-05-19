import express from 'express';

import PlanController from '../../controllers/plan.controller';
import PlanValidator from '../../validators/plan.validator';
import { apiValidate } from '../../middleware/apiValidate';

const router = express.Router();

router.get('/', PlanController.getPlans);
router.get('/remove-plan', apiValidate(PlanValidator.removePlan, 'query'), PlanController.removePlan);
router.get('/:planId', PlanController.getPlan);
router.post('/', apiValidate(PlanValidator.createPlan), PlanController.createPlan);

export default router;