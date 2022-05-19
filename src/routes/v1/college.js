import express from 'express';

import { checkAuthentication, checkAuthorization } from '../../middleware/apiAuth';
import CollegeController from '../../controllers/college.controller';

const router = express.Router();

router.get(
    '/profile', 
    checkAuthentication, 
    checkAuthorization,
    CollegeController.getCollegeDetails
);

router.post(
    '/profile', 
    checkAuthentication, 
    checkAuthorization,
    CollegeController.addCollegeDetails
);

export default router;