//CJS

// const express = require('express');

// const mongoose = require('mongoose');
// const methodOverride = require('method-override');
// const path = require('path');
// const ejsMate = require('ejs-mate');


// ES6
import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from "url";
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import localStrategy from 'passport-local';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dns from 'dns';


dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = express();
dotenv.config();

//models
import {user} from './models/user.js'
import {Listing as listing} from './models/listing.js';
import { reviews as review } from './models/reviews.js';

// Error handler and validators
import ExpressError from './middleware/ExpressError.js'
import errorHandler from './middleware/errorHandler.js';
import {validateListing, validateReview} from './schema.js';

// routes
import listingRouter from './routes/listing.js';
import reviewRouter from './routes/review.js';
import userRouter from './routes/user.js'


// utils
import asyncWrap from './utils/aysncWrap.js'
import {valListing, valReview} from './utils/serversideValidation.js'
import { error } from "console";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_DB_URL,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24*3600, // Intervel between session updates in seconds
});
store.on('error', (err) => console.log('Error in Mongo session store', err));
const sessionOptions = {
    store,
    secret: process.env.SECRET,
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
app.use(passport.initialize()); // It adds Passport-related methods and properties to the request object.
app.use(passport.session());    //  This connects Passport authentication to Express Session. It allows Passport to remember the logged-in user between requests.

passport.use(new localStrategy(user.authenticate()));
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            // || "/auth/google/callback", 
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await user.findOne({
                    googleId: profile.id,
                });
            
                if (existingUser) {
                    return done(null, existingUser);
                }

                const randomString = Math.random().toString(36).substring(2, 8);
                const username = `${profile.displayName}-${randomString}`;
                
                const newUser = await user.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: username,
                    profileImage: profile.photos[0].value,
                });
                return done(null, newUser);
            
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((currentUser, done) => {
    done(null, currentUser.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const foundUser = await user.findById(id);
        done(null, foundUser);
    } catch (err) {
        done(err);
    }
});

console.log("===== GOOGLE OAUTH DEBUG =====");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
console.log("================================");
app.engine('ejs', ejsMate);
async function main(){
    await mongoose.connect(process.env.ATLAS_DB_URL);
}
app.use((req, res, next)=>{
    res.locals.success = req.flash('success'); // new listing flash message
    res.locals.error = req.flash('error');
    res.locals.profilePic = req.user?.profileImage || null;
    res.locals.currentUser = req.user;
    next();
});

main()
  .then(() => console.log("DB connection successful"))
  .catch((err) => {
    console.error("Connection failed:");
    console.error(err);
    console.error(err.stack);
  });


app.get('/', (req, res)=>{res.redirect('/listings')});

app.use('/auth', userRouter);
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);

// Error handler
app.use(errorHandler);


app.listen(8080, ()=>{console.log('Server is running on port: 8080')});