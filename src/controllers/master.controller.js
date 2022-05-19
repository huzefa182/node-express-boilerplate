import CountryModel from '../models/Country';
import StateModel from '../models/State';
import CityModel from '../models/City';
import InstituteModel from '../models/Institution';
import MajorModel from '../models/Major';
import { successResponse, errorResponse } from '../helpers/message';

let MasterController = {

    async getCountry(req, res, next){
        try {
            let countryData = await CountryModel.find({},{_id : 0});
            if(countryData.length){
                return successResponse(req, res, countryData, 'Country List');
            }
            return successResponse(req, res, {}, 'Country List');
        } catch (error) {
            return next(error);
        }
    },

    async getStates(req, res, next){
        try {
            const countryId = parseInt(req.query.countryId);
            const stateData = await StateModel.find({ countryId : countryId },{ _id : 0 });
            if(stateData.length) {
                return successResponse(req, res, stateData, 'State List.');
            }
            return successResponse(req, res, {}, 'State List.');
        } catch (error) {
            return next(error);
        }
    },

    async getCities(req, res, next){
        try {
            const stateId = parseInt(req.query.stateId);
            const cityData = await CityModel.find({ stateId : stateId },{ _id : 0 });
            if(cityData.length) {
                return successResponse(req, res, cityData, 'Cities List.');
            }
            return successResponse(req, res, {}, 'Cities List.');
        } catch (error) {
            return next(error);
        }
    },

    async getInstitution(req, res, next){
        try {
            let instituteData = await InstituteModel.find({isActive : true,isOtherInstitute : false},{_id : 0});
            if(instituteData.length){
                return successResponse(req, res, instituteData, 'Institution List');
            }
        } catch (error) {
            return next(error);
        }
    },

    async getMajors(req, res, next) {
        try {
            let fieldOfStudy = req.body.fieldOfStudy;
            fieldOfStudy = fieldOfStudy.toLowerCase();
            
            const majors = await MajorModel.aggregate([{
                $project: {
                    fieldOfStudy: {
                        $toLower: "$fieldOfStudy"
                    },
                    name: 1,
                    specialCode: 1,
                    status: 1
                }
            }, {
                $match: {
                    fieldOfStudy
                }
            }]);

            if(majors.length){
                return successResponse(req, res, { rows: majors, total: majors.length }, 'Majors List.');
            }
            return successResponse(req, res, {}, 'Majors List.');
        } catch (error) {
            return next(error);
        }
    }
}

export default MasterController;
