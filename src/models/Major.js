import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const majorSchema = new Schema({
    fieldOfStudyCode: {
        type: Number,
        required: true
    },
    fieldOfStudy: {
        type: String,
        required: true
    },
    specialCode: {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active','inactive','deleted'],
        default: 'active'
    }
}, {
    timestamps: true,
});

const MajorModel = mongoose.model('Major', majorSchema);

export default MajorModel;
