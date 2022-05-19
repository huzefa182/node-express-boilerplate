import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const citySchema = new Schema({
    cityId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    stateId: {
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

const CityModel = mongoose.model('City', citySchema);

export default CityModel;
