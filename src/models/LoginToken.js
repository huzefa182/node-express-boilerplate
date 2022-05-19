import mongoose from 'mongoose';
const Schema = mongoose.Schema;

let loginTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    accessToken: {
        type: String,
        required: true
    }
},{
    timestamps: true,  
});

const LoginTokenModel = mongoose.model('LoginToken', loginTokenSchema);

export default LoginTokenModel;
