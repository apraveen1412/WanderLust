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
import { fileURLToPath } from "url";
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';

const app = express();

//models
import {Listing as listing} from './DB_model/listing.js' ;
import { reviews as review } from './DB_model/reviews.js';

// Error handler and validators
import ExpressError from './middleware/ExpressError.js'
import errorHandler from './middleware/errorHandler.js';
import {validateListing, validateReview} from './schema.js';

// routes
import listings from './routes/listing.js'
import reviews from './routes/review.js'


// utils
import asyncWrap from './utils/aysncWrap.js'
import {valListing, valReview} from './utils/serversideValidation.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionOptions = {
    secret: 'topSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join('public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());

app.engine('ejs', ejsMate);
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.use((req, res, next)=>{
    res.locals.success = req.flash('success'); // new listing flash message
    next();
})
main()
    .then(()=>console.log('DB connection successful'))
    .catch((err)=>console.log(err));



app.get('/', (req, res)=>{res.redirect('/listings')});
app.use('/listings', listings);

app.use('/', reviews)

// Error handler
app.use(errorHandler);


app.listen(8080, ()=>{console.log('Sever is running on port: 8080')});