import mongoose from 'mongoose';
import {reviews as review} from './reviews.js';

const listingSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true,
        match: [
            /^[^0-9].*/,
            "Title should not start with a number"
        ]
    },
    description : {
        type: String,
    },
    image : {
        url : String,
        filename: String,
    },
    price : {
        type : Number,
        required : true,
        min: 500,
    },
    location : {
        type: String,
        required: true,
    },
    country : {
        type: String,
        required: true,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reviews'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
}, {timestamps: true});

listingSchema.post('findOneAndDelete', async (listing)=>{
    await review.deleteMany({_id: {$in: listing.reviews}});
});

export const Listing = mongoose.model('Listing', listingSchema);

