import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import ejsMate from 'ejs-mate';
import passport from 'passport';

// Error handler and validators
import ExpressError from '../middleware/ExpressError.js'
import errorHandler from '../middleware/errorHandler.js';

//middleware
import { isLoggedIn, isCreatedUser, saveRedirectURL } from '../middleware/athenticate.js';

// utils
import asyncWrap from '../utils/aysncWrap.js'
import {valListing, valReview} from '../utils/serversideValidation.js'

// Controllers
import { index, newListing, addListing, putEditListing, getEditListing, searchListing, showListing, deleteListing } from '../controllers/listings.js';

const router = express.Router();

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));


// home
router.get("/", asyncWrap(index));

// new listing route
router.get("/new", saveRedirectURL, isLoggedIn, asyncWrap(newListing));

// search handling route
router.get("/search", asyncWrap(searchListing));

// creates a new listing in DB
router.post('/', isLoggedIn, valListing('new'), asyncWrap(addListing));

// deletes a specific lising
router.delete('/:id', isLoggedIn, isCreatedUser, asyncWrap(deleteListing));

// edit handling route
router.get("/:id/edit", saveRedirectURL, isLoggedIn, isCreatedUser,asyncWrap(getEditListing));

// edits a specific listing
router.put("/:id", isLoggedIn, isCreatedUser, valListing('edit'), asyncWrap(putEditListing));

// show lisitng route
router.get("/:id",saveRedirectURL, asyncWrap(showListing));

export default router;