import UserModel from '../models/User';
import StudentDetailModel from '../models/StudentDetail';
import ComparisonModel from '../models/Comparison';
import { successResponse, errorResponse } from '../helpers/message';
import httpStatus from 'http-status';

let StudentController = {

    /**
     * function to save student's profile details
     */
    async addStudentDetails(req, res, next) {
        try {
            const reqData = req.body;
            const isProfileCompleted = reqData.isProfileCompleted || false;
            const studentId = req.params.studentId;
            const studentData = req.user;
            
            const student = await StudentDetailModel.findOne({ user: studentData._id });
            
            if(student) {
                await student.remove();    
            }

            reqData.profileDetail.user = studentData._id;
            // console.log("req data ",reqData.profileDetail);
            const newObj = await StudentDetailModel.create(reqData.profileDetail);
            if(newObj) {
                let updateObj = { profileStepCompleted: reqData.profileStepCompleted, isProfileCompleted }
                if(reqData.profileStepCompleted == 1){
                    if(reqData.profileDetail.basic.NAME){
                        updateObj.firstName = reqData.profileDetail.basic.NAME.split(' ').slice(0, -1).join(' ');
                        updateObj.lastName = reqData.profileDetail.basic.NAME.split(' ').slice(-1).join(' ');
                    }
                    updateObj.country = reqData.profileDetail.basic.COUNTRY
                    updateObj.state = reqData.profileDetail.basic.STATE
                    updateObj.city = reqData.profileDetail.basic.CITY
                    updateObj.zipCode = reqData.profileDetail.basic.ZIP
                }
                await UserModel.updateOne({ _id: studentData._id }, { $set: updateObj});
            }
            return successResponse(req, res, newObj, 'Student details inserted successfully.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to fetch student's profile details
     */
    async getStudentDetails(req, res, next) {
        try {
            const reqData = req.body;
            const userData = req.user;
            let student = await StudentDetailModel.findOne({ user: userData._id }).
            populate({ 
                path: 'user', 
                select: 'email userType profileStepCompleted isProfileCompleted',
                populate: {
                    path: 'plan',
                    select: 'name price icon type', 
                }
            }).exec();
            
            if(!student) {
                return errorResponse(req, res, 'No Record Found.');
            }
            
            student = JSON.parse(JSON.stringify(student));
            const profilePercentArray = {0:0,1:15,2:30,3:45,4:60,5:75,6:90,7:100};
            student.user.profilePercent = profilePercentArray[student.user.profileStepCompleted];
            
            return successResponse(req, res, student, 'Student details.');
        }
        catch(error) {
            return next(error);
        }
    },
    
    /**
     * function to fetch college comparisons by student
     */
     async getCollegeComparison(req, res, next) {
        try {
            const userType = req.query.userType ? req.query.userType : 'student'; 
            const userData = req.user;
            
            const comparisons = await ComparisonModel.find({ user: userData._id, userType });
            
            if(comparisons.length) {
                return successResponse(req, res, { rows: comparisons, total: comparisons.length }, 'College comparison details.');
            }
            
            return successResponse(req, res, { rows: [], total: 0 }, 'No record(s) found.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to insert college id's in student comparison collection
     */
     async addCollegeComparison(req, res, next) {
        try {
            const reqData = req.body;
            const userData = req.user;
            
            const newComparison = await ComparisonModel.create({
                user: userData.id,
                title: reqData.title,
                college: reqData.college
            });
            
            return successResponse(req, res, newComparison, 'College comparison data added successfully.');
        }
        catch(error) {
            return next(error);
        }
    },

     /**
     * function to fetch all student's details
     */
    async getAllStudentList(req, res, next) {
        try {
            let limit = req.query.limit || 10;
            let offset = req.query.offset || 0;

            let users = await UserModel.find({ userType: 'student', isActive : true }).skip(parseInt(offset)).limit(parseInt(limit));
            // let users = await UserModel.find({ userType: 'users', isActive : true });

            if(!users.length) {
                return errorResponse(req, res, 'No Record Found.');
            }
            
            users = JSON.parse(JSON.stringify(users));
            
            return successResponse(req, res, users, 'All Student details.');
        }
        catch(error) {
            return next(error);
        }
    },

    async adminReport(req, res, next) {
        try {
            const data = await UserModel.aggregate([{
                $addFields: {
                    month: {
                        $dateToString: {
                            format: "%m",
                            date: "$createdAt"
                        }
                    },
                }
            }, {
                $match: {
                    profileStepCompleted: 8,
                    isProfileCompleted: true
                }
            }, {
                $group: {
                    _id: "$month",
                    numberOfProfileCompleted: {
                        $sum: 1
                    }
                }
            }]);

            return successResponse(req, res, data, 'Data listed successfully.');
        }
        catch(error) {
            return next(error);
        }
    }
}

export default StudentController;
