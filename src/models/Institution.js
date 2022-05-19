import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const instituteSchema = new Schema({}, {
    timestamps: true,
});

const InstituteModel = mongoose.model('institution', instituteSchema);

export default InstituteModel;
