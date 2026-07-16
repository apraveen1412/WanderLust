import express from 'express';
import passport from 'passport';

// models
import {user} from '../models/user.js'

// utils
import asyncWrap from '../utils/aysncWrap.js'

// middlewares
import { saveRedirectURL } from '../middleware/athenticate.js';
import { getLogin, getLogout, getSignup, googleAuthenticate, googleCallback, postLogin, postSignup } from '../controllers/users.js';

const router = express.Router();



// SIGN UP
router.get('/signup', asyncWrap(getSignup));

router.post('/signup', asyncWrap(postSignup));

// GOOGLE
router.get("/google", passport.authenticate("google", {
        scope: ["profile", "email"],
    }), googleAuthenticate);
router.get("/google/callback",
    saveRedirectURL,
    passport.authenticate("google", {
        failureRedirect: "/auth/signup",
        keepSessionInfo: true,
    }), googleCallback);


// LOGIN
router.get('/login', asyncWrap(getLogin));

router.post('/login', saveRedirectURL, passport.authenticate('local',{failureRedirect: '/auth/login', failureFlash: true, keepSessionInfo: true}), asyncWrap(postLogin));


router.get('/logout', getLogout);

export default router;