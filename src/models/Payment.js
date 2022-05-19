import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
    },
    service: {
        type: Array,
        default: []
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ['cash','online'],
        default: 'online'
    },
    method: {
        type: String,
        enum: ['card','netbanking','wallet','upi'],
        default: 'card'
    },
    source: {
        type: Object,
        default: {}
    },
    log: {
        type: Object,
        default: {}
    },
    description: {
        type: String,
    },
    baseCurrency: {
        type: String,
        default: 'USD'
    },
    currency: {
        type: String,
        default: 'USD'
    },
    purchaseType: {
        type: String,
        enum: ['plan','service'],
        default: 'plan'
    },
    status: {
        type: String,
        enum: ['pending','succeeded','failed'],
        default: 'pending'
    }
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
