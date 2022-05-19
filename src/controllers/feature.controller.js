import FeatureModel from '../models/Feature';
import { successResponse, errorResponse } from '../helpers/message';
import httpStatus from 'http-status';

let FeatureController = {

    /**
     * function to create plan
     */
    async createFeature(req, res, next) {
        try {
            const featureData = req.body;
            const feature = await FeatureModel.create(featureData);
            return successResponse(req, res, feature, 'Feature created successfully.');
        }
        catch(error) {
            return next(error);
        }
    },

    /**
     * function to fetch plan
     */
    async getFeatures(req, res, next) {
        try {
            const features = await FeatureModel.find({ status: 'active' }).sort({ sortOrder: 1 });
            if(features.length) {
                return successResponse(req, res, { rows: features, total: features.length }, 'Feature(s) List.');
            }
            return successResponse(req, res, { }, 'No Record(s) Found.');
        }
        catch(error) {
            return next(error);
        }
    }
}

export default FeatureController;
