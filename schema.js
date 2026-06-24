import Joi from "joi";

export const validateListing = Joi.object({
    title: Joi.string().pattern(/^[^0-9].*/).min(5).required().messages({
        'string.pattern.base': "Title should not start with a character",
        'string.empty': 'Title cannot be empty',
    }),
    description: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    price: Joi.number().min(500).required(),
    location: Joi.string().required(),
    country: Joi.string().pattern(/^[A-Za-z]/).required(),
});

export const validateReview=Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
});