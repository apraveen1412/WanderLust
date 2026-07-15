import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import ejsMate from 'ejs-mate';
import passport from 'passport';

//models
import {Listing as listing} from '../models/listing.js' ;
import { reviews as review } from '../models/reviews.js';


// Error handler and validators
import ExpressError from '../middleware/ExpressError.js'
import errorHandler from '../middleware/errorHandler.js';

//middleware
import { isLoggedIn, isCreatedUser } from '../middleware/athenticate.js';

// utils
import asyncWrap from '../utils/aysncWrap.js'
import {valListing, valReview} from '../utils/serversideValidation.js'
import getReview from '../utils/getReview.js'


const router = express.Router();


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));




// home
router.get("/", async (req, res)=>{
    const list = await listing.find({});
    res.render('listing', {list, search: undefined});
});

// new listing route
router.get("/new", isLoggedIn, asyncWrap(async (req, res, next)=>{
    res.render('new', {});
}));

// search handling route
router.get("/search", asyncWrap(async (req, res, next)=>{
    let {search} = req.query;
    if(search !== ''){
        const list = await listing.find({
        $or: [
            {title: { $regex: new RegExp(search, 'i') }},
            {location: { $regex: new RegExp(search, 'i') }},
            {country: { $regex: new RegExp(search, 'i') }},
        ]});
        // Handle no results
        if (list.length === 0) {
            return res.render('listing', { list: [], search });
        }

        res.render('listing', { list, search });
    }
    else return res.render('listing', { list: [], search });
}));

// creates a new listing in DB
router.post('/', isLoggedIn, valListing('new'), asyncWrap(async (req, res, next)=>{
    let newProperty = new listing(req.body);
    newProperty.owner = req.user._id;
    req.flash('success', 'Successfully added new listing');
    await newProperty.save(); 
    res.redirect('/listings');
}));

// deletes a specific lising
router.delete('/:id', isLoggedIn, isCreatedUser, asyncWrap(async (req, res, next)=>{
    let id = req.params.id;
    const listed = await listing.findByIdAndDelete({_id: id});
    if(!listed) return next(new ExpressError(404, "Nothing to delete"));
    req.flash('success', 'Successfully deleted the listing');
    res.redirect('/listings');
}));

// edit handling route
router.get("/:id/edit", isLoggedIn, isCreatedUser,asyncWrap(async (req, res, next)=>{
    let id = req.params.id;
    const listed = await listing.findById(id);
    if(!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('edit', {listed});
}));

// edits a specific listing
router.put("/:id", isLoggedIn, isCreatedUser, valListing('edit'), asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    if (!id) return next(new ExpressError(404, "Listing doesn't exist"));
    await listing.findByIdAndUpdate(id, req.body, { runValidators: true });
    req.flash('success', 'Successfully updated the listing');
    res.redirect(`/listings/${id}`);
}));

// show lisitng route
router.get("/:id", asyncWrap(async (req, res, next)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ExpressError(404, "Invalid listing"));
    let { listed, listedReviews } = await getReview(id);
    if (!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('show', { listed, listedReviews });
}));

export default router;