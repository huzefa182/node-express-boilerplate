import express from 'express';

import MasterController from '../../controllers/master.controller';
import MasterValidator from '../../validators/master.validator';
import { apiValidate } from '../../middleware/apiValidate';

const router = express.Router();

router.get('/country', MasterController.getCountry);
router.get('/state', MasterController.getStates);
router.get('/city', MasterController.getCities);
router.get('/institution', MasterController.getInstitution);
router.post('/major', apiValidate(MasterValidator.majorList), MasterController.getMajors);

export default router;