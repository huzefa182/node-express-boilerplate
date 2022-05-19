import express from 'express';

import { checkAuthentication, checkAuthorization } from '../../middleware/apiAuth';
import { apiValidate } from '../../middleware/apiValidate';
import StudentController from '../../controllers/student.controller';
import PlanController from '../../controllers/plan.controller';
import ServiceController from '../../controllers/service.controller';
import PlanValidator from '../../validators/plan.validator';
import UserValidator from '../../validators/user.validator';

const router = express.Router();

router.get('/', StudentController.getAllStudentList);

router.get(
    '/profile', 
    checkAuthentication, 
    checkAuthorization,
    StudentController.getStudentDetails
);

router.post(
    '/profile', 
    checkAuthentication, 
    checkAuthorization,
    StudentController.addStudentDetails
);

router.get(
    '/college-comparison', 
    checkAuthentication, 
    checkAuthorization,
    StudentController.getCollegeComparison
);

router.post(
    '/college-comparison', 
    checkAuthentication, 
    checkAuthorization,
    apiValidate(UserValidator.compareCollege),
    StudentController.addCollegeComparison
);

router.post(
    '/purchase-plan', 
    apiValidate(PlanValidator.purchasePlan),
    checkAuthentication, 
    checkAuthorization,
    PlanController.purchasePlan
);

router.post(
    '/purchase-service', 
    apiValidate(PlanValidator.purchaseService),
    checkAuthentication, 
    checkAuthorization,
    ServiceController.purchaseService
);

router.get(
    '/admin-report', 
    StudentController.adminReport
);

export default router;