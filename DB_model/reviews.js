// import { required } from "joi";
import mongoose from "mongoose";

// Models
// import user from './user'; 

const reviewSchema = mongoose.Schema({
    // user: {},
    comment: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, {timestamps: true});

export const reviews = mongoose.model('reviews', reviewSchema);