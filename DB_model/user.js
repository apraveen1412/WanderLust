import { required } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: Number,
        min: 10,
        max: 10,
        required: true,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review'
    }],
});

export const user = mongoose.model('user', userSchema );