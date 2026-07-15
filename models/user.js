import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String
    },
    googleId: {type: String},
    profileImage: {
        type: String,
        default: './assets/profile.png',
        set: (v) => v === "" ? '/assets/profile.png' : v,
    },
    // phoneNumber: {
    //     type: Number,
    //     min: 10,
    //     max: 10,
    //     required: true,
    // },
    // reviews: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'review'
    // }],
}, {timestamps: true});
userSchema.plugin(passportLocalMongoose.default);

export const user = mongoose.model('user', userSchema );