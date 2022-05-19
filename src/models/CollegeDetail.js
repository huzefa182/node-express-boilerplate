import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const collegeDetailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    instituteReg: {
        type: Object,
        default: {}
    },
    aboutTheInstitution: {
        type: Object,
        default: {}
    },
    admissions: {
        type: Object,
        default: {}
    },
    academicsAndExtracurriculars: {
        type: Object,
        default: {}
    },
    campusInfrastructure: {
        type: Object,
        default: {}
    },
    placement: {
        type: Object,
        default: {}
    }
},
{ 
    timestamps: true,
    minimize: false
});

const CollegeDetail = mongoose.model('CollegeDetail', collegeDetailSchema);

export default CollegeDetail;