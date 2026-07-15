import express from 'express';
import passport from 'passport';

// models
import {user} from '../models/user.js'

// utils
import asyncWrap from '../utils/aysncWrap.js'

// middlewares
import { saveRedirectURL } from '../middleware/athenticate.js';

const router = express.Router();



// SIGN UP
router.get('/signup', asyncWrap(async (req, res, next)=>{
    res.render('signup',{formData: null});
}));

router.post('/signup', asyncWrap(async (req, res, next)=>{
    let addUser = new user({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
    });
    let newUser = await user.register(addUser, req.body.password);
    if(!newUser.username === 'undefined')    return res.redirect('/auth/signup'); 
    req.login(newUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'Welcome to WanderLust!');
        return res.redirect('/listings');
    });
}));

router.get("/google", passport.authenticate("google", {
        scope: ["profile", "email"],
    }), 
    (req, res) => {
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
    }
);
router.get("/google/callback",

    passport.authenticate("google", {
        failureRedirect: "/auth/signup",
    }),

    (req, res) => {
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
    }
);


// LOGIN
router.get('/login', asyncWrap(async (req, res, next)=>{
    res.render('signin',{formData: null});
}));

router.post('/login', saveRedirectURL, passport.authenticate('local',{failureRedirect: '/auth/login', failureFlash: true}), asyncWrap(async (req, res, next)=>{
    req.flash('success', 'Welcome back!');
    let redirectURL = res.locals.redirectUrl || '/listings';
    res.redirect(redirectURL);
}));


router.get('/logout', (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/listings');
    });
})

export default router;