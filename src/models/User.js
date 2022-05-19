import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        maxLength: 35,
        set: firstName => firstName.charAt(0).toUpperCase() + firstName.slice(1)
    },
    lastName: {
        type: String,
        maxLength: 35,
        set: firstName => firstName.charAt(0).toUpperCase() + firstName.slice(1)
    },
    username : {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    address: {
        type : String
    },
    country : {
        type : String,
        default: 'India'
    },
    countryCode : {
        type: Number,
        default: '91'
    },
    state : {
        type : String,
        default: 'Madhya Pradesh'
    },
    city: {
        type : String,
        default: 'Indore'
    },
    zipCode : {
        type : Number
    },
    userType: {
        type: String,
        enum : ['student','college'],
        required: true
    }, 
    socialType: {
        type: String,
        enum : ['facebook','google','linkedin'],
    },
    socialId: {
        type: String,
    },
    socialToken : {
        type: String,
    },
    instituteId : {
        type : Number
    },
    instituteName : {
        type : String
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordLinkGenerated : {
        type : Boolean,
        default : false
    },
    resetPasswordLinkGeneratedTime : {
        type: Number,
        default: Date.now
    },
    profileStepCompleted: {
        type: Number,
        default: 0
    },
    isProfileCompleted: {
        type : Boolean,
        default : false
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    stripeCustomerId: {
        type: String
    },
    status: {
        type: String,
        enum : ['active','inactive','pending','deleted'],
        default: 'active'
    },
},
{ 
    toJSON: { 
        getters: true,
        transform: function(doc, ret, opt) {
            delete ret['password']
            delete ret['resetPasswordLinkGenerated']
            delete ret['resetPasswordLinkGeneratedTime']
            return ret;
        }
    },
    timestamps: true,
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;