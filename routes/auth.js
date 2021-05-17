const express = require('express')
const passport = require('passport')
const router  = express.Router()


// @desc Login/Landing page/ Authenticate weith google
// @route GET /auth/google 
router.get('/google', passport.authenticate('google', {scope: ['profile']}) )

// @desc Login/Dashboard
// @route GET /dashboard
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),
(req,res) => {
    res.redirect('/dashboard')
})

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect("/")
})
module.exports = router