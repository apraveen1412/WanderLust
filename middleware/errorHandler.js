import Joi from 'joi';

const errorHandler = (err, req, res, next) => {

    if (err instanceof Joi.ValidationError) {
        const msg = err.details.map(el => el.message).join(", ");
        if (err.view) return res.status(400).render(err.view, { msg, listed: err.listed });
        return res.status(400).send(msg);
    }

    if (err.name === "ValidationError") {  // Mongoose
        const msg = Object.values(err.errors).map(el => el.message).join(", ");
        if (err.view) return res.status(400).render(err.view, { msg, listed: err.listed });
        return res.status(400).send(msg);
    }

    const { status = 500, message = "Something went wrong" } = err;
    if (status === 404) return res.status(404).render('./errors/PNF.ejs', { message });
    res.status(status).send(message);
};

export default errorHandler;