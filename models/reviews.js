import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, {timestamps: true});

export const reviews = mongoose.model('reviews', reviewSchema);