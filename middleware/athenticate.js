import express from 'express';
import passport from 'passport';

import { Listing } from '../models/listing.js';
import { reviews } from '../models/reviews.js';

export const isLoggedIn = (req, res, next) => {
    const id = req.params.id;
    // const di = req.body;
    if (!req.isAuthenticated()) {
        // redirect URL
        req.session.redirectURL = req.originalUrl;

        // Create listing
        if ((req.path === '/new' && req.method === 'GET') || (req.path === '/' && req.method === 'POST')) {
            req.flash('error', 'You have to login or signup to create a new listing');
        }
        
        // Delete listing
        else if (req.path === `/${id}` && req.method === 'DELETE') {
            req.flash('error', 'You have to login or signup to delete the listing');
        }
        
        // Edit/update listing
        else if ((req.path === `/${id}/edit` && req.method === 'GET') || (req.path === `/${id}` && req.method === 'PUT')) {
            req.flash('error', 'You have to login or signup to edit the listing');
        }
        return res.redirect('/auth/login');
    }
    next();
};


export const saveRedirectURL = (req, res, next)=>{
    if(req.session.redirectURL){
        res.locals.redirectUrl = req.session.redirectURL;
    }
    next();
}

// Authorization
export const isCreatedUser = async (req, res, next)=>{
    const id = req.params.id;
    try{
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash('error', "The listing you requested doesn't exist");
            return res.redirect('/listings');
        }
        
    if(listing.owner._id.toString() === req.user._id.toString()){
        return next();
    }
    req.flash('error', 'You are not allowed to edit / delete this listing');
    res.redirect(`/listings/${id}`);
    next();
    } catch(err){
        next(err);
    }
}

export const isReviewAuthor = async (req, res, next)=>{
    const {id, reviewId} = req.params;
    try{
        const review = await reviews.findById(reviewId);
        if(!review){
            req.flash('error', "The review you requested doesn't exist");
            return res.redirect(`/listings/${id}`);
        }
        
    if(review.author._id.toString() === req.user._id.toString()){
        return next();
    }
    req.flash('error', 'You are not allowed delete this Review');
    res.redirect(`/listings/${id}`);
    next();
    } catch(err){
        next(err);
    }
}