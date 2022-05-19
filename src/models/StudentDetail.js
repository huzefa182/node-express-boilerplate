import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const studentDetailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    basic: {
        type: Object,
        default: {}
    },
    academicInfo: {
        type: Object,
        default: {}
    },
    collegePreference: {
        type: Object,
        default: {}
    },
    demographicPreference: {
        type: Object,
        default: {}
    },
    employmentInfo: {
        type: Object,
        default: {}
    },
    placementPreference: {
        type: Object,
        default: {}
    },
    finalPreference: {
        type: Object,
        default: {}
    }
},
{ 
    timestamps: true,
    minimize: false
});

const StudentDetail = mongoose.model('StudentDetail', studentDetailSchema);

export default StudentDetail;