import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const comparisonSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userType: {
        type: String,
        enum: ['student','college'],
        default: 'student'
    },
    title: {
        type: String,
    },
    college: {
        type: Array,
        default: []
    },
    student: {
        type: Array,
        default: []
    }
},
{ 
    timestamps: true,
    minimize: false
});

const Comparison = mongoose.model('Comparison', comparisonSchema);

export default Comparison;