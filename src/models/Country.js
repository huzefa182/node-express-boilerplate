import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const countrySchema = new Schema({
    countryId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active','inactive','deleted'],
        default: 'active'
    }
},{
    timestamps: true,
});

const CountryModel = mongoose.model('Country', countrySchema);

export default CountryModel;
