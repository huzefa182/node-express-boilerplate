import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const featureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    plan: {
        type: Array,
        default: [],
        required: true,    
    },
    sortOrder: {
        type: Number,
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

const Feature = mongoose.model('Feature', featureSchema);

export default Feature;
