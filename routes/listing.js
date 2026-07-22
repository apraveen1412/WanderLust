import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import multer from 'multer';


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

// cloud
import { cloudinary, storage } from '../cloudConfig.js';

const router = express.Router();
const upload = multer({storage});


router.route('/')
    .get(asyncWrap(index)) // home
    .post( isLoggedIn, valListing('new'), upload.single('image'), asyncWrap(addListing)); // creates a new listing in DB

// new listing route
router.get("/new", saveRedirectURL, isLoggedIn, asyncWrap(newListing));

// search handling route
router.get("/search", asyncWrap(searchListing));

// edit handling route
router.get("/:id/edit", saveRedirectURL, isLoggedIn, isCreatedUser,asyncWrap(getEditListing));

router.route('/:id')
    .get(saveRedirectURL, asyncWrap(showListing)) // show lisitng route
    .delete(isLoggedIn, isCreatedUser, asyncWrap(deleteListing)) // deletes a specific lising
    .put(isLoggedIn, isCreatedUser, valListing('edit'), upload.single("image"), asyncWrap(putEditListing)); // edits a specific listing

export default router;