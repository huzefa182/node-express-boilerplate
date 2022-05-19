import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import config from '../config';

const Schema = mongoose.Schema;

const planSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    feature: {
        type: Array,
        default: [],
        required: true,    
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
    },
    type: {
        type: String,
        enum: ['free','paid'],
        default: 'free',
        required: true
    },
    icon: {
        type: String,
        get: function(icon) {
            if (icon && fs.existsSync(path.join(__dirname, `../uploads/${icon}`))) {
                return config.app.backendUrl + `/backend-assets/${icon}`;
            } else {
                return config.app.backendUrl + `/backend-assets/default.png`;
            }
        },
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
    toJSON: { getters: true }
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
