import mongoose from 'mongoose';

// models
import { Listing as listing } from "../models/listing.js";

// utils
import getReview from '../utils/getReview.js'

// Error handler 
import ExpressError from '../middleware/ExpressError.js'

export const index = async (req, res)=>{
    const list = await listing.find({});
    res.render('listing', {list, search: undefined});
}

export const newListing = async (req, res, next)=>{
    res.render('new', {});
};


export const searchListing = async (req, res, next)=>{
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
}

export const addListing = async (req, res, next)=>{
    let newProperty = new listing(req.body);
    newProperty.owner = req.user._id;
    newProperty.image.url = req.file.path;
    newProperty.image.filename = req.file.filename; 
    console.log(newProperty);
    req.flash('success', 'Successfully added new listing');
    await newProperty.save(); 
    res.redirect('/listings');
}

export const getEditListing = async (req, res, next)=>{
    let id = req.params.id;
    const listed = await listing.findById(id);
    let originalImage = listed.image.url;
    originalImage = originalImage.replace('/upload', '/upload/h_150');
    if(!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('edit', {listed, originalImage});
}

export const putEditListing = async (req, res, next) => {
    let { id } = req.params;
    if (!id) return next(new ExpressError(404, "Listing doesn't exist"));
    let currentListing = await listing.findById(id);
    let updatedListing = req.body;
    if(typeof req.file !== 'undefined'){
        if (!updatedListing.image) {
            updatedListing.image = {};
        }
        updatedListing.image.url = req.file.path;
        updatedListing.image.filename = req.file.filename;
    }
    await listing.findByIdAndUpdate(id, updatedListing, { runValidators: true });
    req.flash('success', 'Successfully updated the listing');
    res.redirect(`/listings/${id}`);
}

export const showListing = async (req, res, next)=>{
    let {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ExpressError(404, "Invalid listing"));
    let { listed, listedReviews } = await getReview(id);
    if (!listed) return next(new ExpressError(404, "Listing doesn't exist"));
    res.render('show', { listed, listedReviews });
}

export const deleteListing = async (req, res, next)=>{
    let id = req.params.id;
    const listed = await listing.findByIdAndDelete({_id: id});
    if(!listed) return next(new ExpressError(404, "Nothing to delete"));
    req.flash('success', 'Successfully deleted the listing');
    res.redirect('/listings');
}