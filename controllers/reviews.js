//models
import {Listing as listing} from '../models/listing.js';
import { reviews as Review} from '../models/reviews.js';

export const postReview = async (req, res, next)=>{
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    const id = req.params.id;
    let data = await listing.findById(id);
    data.reviews.push(newReview);
    await newReview.save();
    await data.save();
    req.flash('success', 'Review posted successfully');
    res.redirect(`/listings/${id}`);
}

export const deleteReview = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/listings/${id}`);
}