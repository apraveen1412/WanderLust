import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import ejsMate from 'ejs-mate';



// Error handler and validators
import ExpressError from '../middleware/ExpressError.js'
import errorHandler from '../middleware/errorHandler.js';

// utils
import asyncWrap from '../utils/aysncWrap.js'
import {valListing, valReview} from '../utils/serversideValidation.js'
import getReview from '../utils/getReview.js'
import { isLoggedIn, isReviewAuthor } from '../middleware/athenticate.js';
import { deleteReview, postReview } from '../controllers/reviews.js';


const router = express.Router({mergeParams: true});


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));


// handling reviews
router.post('/', isLoggedIn, valReview('show'), asyncWrap(postReview));

// deleting reviews
router.delete('/:reviewId', isReviewAuthor, asyncWrap(deleteReview));

export default router;