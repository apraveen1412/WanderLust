import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import ejsMate from 'ejs-mate';

//models
import {Listing as listing} from '../DB_model/listing.js' ;
import { reviews as review } from '../DB_model/reviews.js';

// Error handler and validators
import ExpressError from '../middleware/ExpressError.js'
import errorHandler from '../middleware/errorHandler.js';

// utils
import asyncWrap from '../utils/aysncWrap.js'
import {valListing, valReview} from '../utils/serversideValidation.js'
import getReview from '../utils/getReview.js'


const router = express.Router({mergeParams: true});


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));


// handling reviews
router.post('/listings/:id/reviews', valReview('show'), asyncWrap(async (req, res, next)=>{
    const newReview = new review(req.body);
    const id = req.params.id;
    // console.log(id);
    let data = await listing.findById(id);
    // console.log(data);
    data.reviews.push(newReview);
    await newReview.save();
    await data.save();
    req.flash('success', 'Review posted successfully');
    res.redirect(`/listings/${id}`);
}));

// deleting reviews
router.delete('/listings/:id/reviews/:reviewId', asyncWrap(async (req, res, next)=>{
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/listings/${id}`);
}));

export default router;