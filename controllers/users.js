// models
import {user} from '../models/user.js'

// utils
import asyncWrap from '../utils/aysncWrap.js'

// middlewares
import { saveRedirectURL } from '../middleware/athenticate.js';


// SIGN UP
export const getSignup = async (req, res, next)=>{
    res.render('signup',{formData: null});
}

export const postSignup =async (req, res, next)=>{
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
}

export const googleAuthenticate = (req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    res.redirect("/listings");
}
    
export const googleCallback = (req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    let redirectURL = res.locals.redirectUrl || '/listings';
    delete req.session.redirectURL;
    res.redirect(redirectURL);
}


// LOGIN
export const getLogin = async (req, res, next)=>{
    res.render('signin',{formData: null});
}

export const postLogin = async (req, res, next)=>{
    req.flash('success', 'Welcome back!');
    let redirectURL = res.locals.redirectUrl || '/listings';
    delete req.session.redirectURL;
    res.redirect(redirectURL);
}


export const getLogout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'You are logged out');
        res.redirect('/listings');
    });
}