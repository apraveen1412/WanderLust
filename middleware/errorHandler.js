import Joi from 'joi';

const errorHandler = (err, req, res, next) => {

    if (err instanceof Joi.ValidationError) {
        const msg = err.details.map(el => el.message).join(", ");
        if (err.view) {
            const listed = err.listed || null;
            const listedReviews = listed?.reviews || [];  //  extract reviews
            return res.status(400).render(err.view, { msg, listed, listedReviews });
        }
        return res.status(400).send(msg);
    }

    if (err.name === "ValidationError") {
        const msg = Object.values(err.errors).map(el => el.message).join(", ");
        if (err.view) {
            const listed = err.listed || null;
            const listedReviews = listed?.reviews || [];  // extract reviews
            return res.status(400).render(err.view, { msg, listed, listedReviews });
        }
        return res.status(400).send(msg);
    }

    const { status = 500, message = "Something went wrong" } = err;
    if (status === 404) return res.status(404).render('./errors/PNF.ejs', { message });
    res.status(status).render('errors/PNF.ejs', { message });
};

export default errorHandler;