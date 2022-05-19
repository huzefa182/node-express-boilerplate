import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    countryId: {
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

const StateModel = mongoose.model('State', stateSchema);

export default StateModel;
