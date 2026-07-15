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

    if (err.name === "UserExistsError") {
        return res.status(400).render("signup", {
            formData: {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
            },
            error: [err.message]
        });
    }
    console.error(err);
    const { status = 500, message = "Something went wrong" } = err;
    if (status === 404) {
        req.flash("error", message);
        return res.redirect("/listings");
    }

req.flash("error", message);
return res.redirect("/listings");
};

export default errorHandler;