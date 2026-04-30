const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
        trim: true,
    },
    description : {
        type: String,
    },
    image : {
        type : String,
        default : 'https://images.unsplash.com/photo-1709884735017-114f4a31f944?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        set: (v) => v === "" ? 'https://images.unsplash.com/photo-1709884735017-114f4a31f944?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : v,
    },
    price : {
        type : Number,
        required : true,
        min: 0,
    },
    location : {
        type: String,
        required: true,
    },
    country : {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;