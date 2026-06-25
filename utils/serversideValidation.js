// error handlers & validators
import {validateListing, validateReview} from '../schema.js'

//serverside validation
export const valListing = (route) => {
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

export const valReview = (route) => {
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