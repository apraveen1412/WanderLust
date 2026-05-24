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

// Error handler
import ExpressError from './views/errors/ExpressError.js'

app.set('views', path.join('views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join('public')));
app.use(express.urlencoded({ extended: true }));
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

// new listing route
app.get("/listings/new", asyncWrap(async (req, res)=>{
    res.render('new', {});
}));

// search handling route
app.get("/listings/search", asyncWrap(async (req, res)=>{
    let {search} = req.query;
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
}));

// creates a new listing in DB
app.post('/listings/', asyncWrap(async (req, res)=>{
    let newProperty = req.body;
    let temp = new listing({
        title: newProperty.title,
        description: newProperty.description,
        image: newProperty.image,
        price: newProperty.price,
        location: newProperty.location,
        country: newProperty.country,
    });
    await temp.save(); 
    console.log(temp);
    res.redirect('/listings');
}));

// deletes a specific lising
app.delete('/listings/:id', asyncWrap(async (req, res)=>{
    let {id} = req.params;
    const listed = await listing.findByIdAndDelete({_id: id});
    if(!listed) return next(new ExpressError(404, "Nothing to delete"));
    res.redirect('/listings');
}));

// edit handling route
app.get("/listings/:id/edit", asyncWrap(async (req, res)=>{
    let {id} = req.params;
    const listed = await listing.findById(id);
    if(!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('edit', {listed});
}));

// edits a specific listing
app.put("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id, req.body, {returnDocument: 'after'});
    res.redirect(`/listings/${id}`);
});

// show lisitng route
app.get("/listings/:id", asyncWrap(async (req, res, next)=>{
    let {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id))    return next( new ExpressError(404, "Invalid listing"));
    else{
        const listed = await listing.findById(id);
        if(!listed) return next( new ExpressError(404, "Listing doesn't exist"));
        else res.render('show', {listed});
    }
}));


// Error handler
app.use((err, req, res, next)=>{
    let {status = 500, message = "Something went wrong"} = err;
    console.error(message);
    if(status === 404){
        return res.status(404).render('./errors/PNF.ejs', {message});
    }
    res.status(status).send(message);
});


app.listen(8080, ()=>{console.log('Sever is running on port: 8080')});