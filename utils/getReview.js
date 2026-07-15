//models
import {Listing as listing} from '../models/listing.js';
import { reviews as review } from '../models/reviews.js';

// get reviews
async function getReview(id) {
    const listed = await listing.findById(id)
        .populate({
            path: 'reviews',        // 1. Populate the reviews array
            populate: {
                path: 'author'      // 2. Inside every review, populate the author
            }
        })
        .populate('owner');         // 3. Also populate the owner of the listing

    if (!listed) return { listed: null, listedReviews: [] };

    console.log(listed)
    return { listed, listedReviews: listed.reviews };
}

export default getReview;