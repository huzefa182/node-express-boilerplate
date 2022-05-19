import UserModel from '../models/User';
import CollegeDetailModel from '../models/CollegeDetail';
import { successResponse, errorResponse } from '../helpers/message';
import httpStatus from 'http-status';

let CollegeController = {

    /**
     * function to save College's profile details
     */
    async addCollegeDetails(req, res, next) {
        try {
            const reqData = req.body;
            const isProfileCompleted = reqData.isProfileCompleted || false;
            const collegeData = req.user;
            
            const college = await CollegeDetailModel.findOne({ user: collegeData._id });
            
            if(college) {
                await college.remove();    
            }
            
            reqData.profileDetail.user = collegeData._id;

            const newObj = await CollegeDetailModel.create(reqData.profileDetail);
            
            if(newObj) {
                let updateObj = { profileStepCompleted: reqData.profileStepCompleted, isProfileCompleted }
                await UserModel.updateOne({ _id: collegeData._id }, { $set: updateObj});
            }
            return successResponse(req, res, newObj, 'College details inserted successfully.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to fetch College's profile details
     */
    async getCollegeDetails(req, res, next) {
        try {
            const reqData = req.body;
            const userData = req.user;
            let college = await CollegeDetailModel.findOne({ user: userData._id }).populate({ path: 'user', select: 'email userType profileStepCompleted isProfileCompleted'}).exec();
            
            if(!college) {
                return errorResponse(req, res, 'No Record Found.');
            }
            
            college = JSON.parse(JSON.stringify(college));
            const profilePercentArray = {0:0,1:15,2:30,3:45,4:60,5:75,6:90,7:100};
            college.user.profilePercent = profilePercentArray[college.user.profileStepCompleted];
            
            return successResponse(req, res, college, 'College details.');
        }
        catch(error) {
            return next(error);
        }
    }
}

export default CollegeController;
