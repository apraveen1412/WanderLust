//CJS

// const express = require('express');

// const mongoose = require('mongoose');
// const methodOverride = require('method-override');
// const path = require('path');
// const ejsMate = require('ejs-mate');


// ES6
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import ejsMate from 'ejs-mate';

const app = express();

//models
import {Listing as listing} from './DB_model/listing.js' ;
import { reviews as review } from './DB_model/reviews.js';

// Error handler and validators
import ExpressError from './middleware/ExpressError.js'
import errorHandler from './middleware/errorHandler.js';
import {validateListing, validateReview} from './schema.js';

app.set('views', path.join('views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join('public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));



app.get('/', (req, res)=>{res.redirect('/listings')});
app.get("/listings", async (req, res)=>{
    const list = await listing.find({});
    res.render('listing', {list, search: undefined});
});

// Async Wrapper
function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch(next);
    };
}

//serverside validation
const valListing = (route) => {
    return async (req, res, next) => {
        let { error } = validateListing.validate(req.body, { abortEarly: false });
        if (error) {
            error.view = route;
            if (req.params.id) {
                error.listed = await listing.findById(req.params.id);
            }
            return next(error);
        }
        next();
    }
}
const valReview = (route) => {
    return async (req, res, next) => {
        let { error } = validateReview.validate(req.body, { abortEarly: false });
        if (error) {
            error.view = route;
            if (req.params.id) {
                error.listed = await listing.findById(req.params.id).populate('reviews');
            }
            return next(error);
        }
        next();
    }
}

// get reviews
async function getReview(id){
    const listed = await listing.findById(id).populate('reviews');
     if (!listed) return { listed: null, listedReviews: [] };
    let listedReviews = [];
    for(let rev of listed.reviews){
        listedReviews.push(rev);
    }
    // console.log(lisingReviews);
    return {listed, listedReviews};
}

// new listing route
app.get("/listings/new", asyncWrap(async (req, res, next)=>{
    res.render('new', {});
}));

// search handling route
app.get("/listings/search", asyncWrap(async (req, res, next)=>{
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
app.post('/listings/',valListing('new'), asyncWrap(async (req, res, next)=>{
    let newProperty = new listing(req.body);

    await newProperty.save(); 
    res.redirect('/listings');
}));

// deletes a specific lising
app.delete('/listings/:id', asyncWrap(async (req, res, next)=>{
    let id = req.params.id;
    const listed = await listing.findByIdAndDelete({_id: id});
    if(!listed) return next(new ExpressError(404, "Nothing to delete"));
    res.redirect('/listings');
}));

// edit handling route
app.get("/listings/:id/edit", asyncWrap(async (req, res, next)=>{
    let id = req.params.id;
    const listed = await listing.findById(id);
    if(!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('edit', {listed});
}));

// edits a specific listing
app.put("/listings/:id",valListing('edit'), asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    if (!id) return next(new ExpressError(404, "Listing doesn't exist"));
    await listing.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/listings/${id}`);
}));

// show lisitng route
app.get("/listings/:id", asyncWrap(async (req, res, next)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ExpressError(404, "Invalid listing"));
    let { listed, listedReviews } = await getReview(id);
    if (!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('show', { listed, listedReviews });
}));

app.post('/listings/:id/reviews', valReview('show'), asyncWrap(async (req, res, next)=>{
    const newReview = new review(req.body);
    const id = req.params.id;
    // console.log(id);
    let data = await listing.findById(id);
    // console.log(data);
    data.reviews.push(newReview);
    await newReview.save();
    await data.save();
    res.redirect(`/listings/${id}`);
}));

// Error handler
app.use(errorHandler);


app.listen(8080, ()=>{console.log('Sever is running on port: 8080')});