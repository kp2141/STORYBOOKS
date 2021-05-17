const express = require('express')
const router  = express.Router()
const {ensureAuth, ensureGuest} = require("../middleware/auth")
const story = require('../models/Story')

// @desc Login/Landing page
// @route GET / 
router.get("/",ensureGuest, (req,res) => {
    res.render("login",{
    layout:'login',
    })
} )

// @desc Login/Dashboard
// @route GET /dashboard
router.get("/dashboard", ensureAuth, async (req,res) => {
    try {
        const stories = await story.find({user:req.user.id}).lean()
        res.render('dashboard',{
            name: req.user.firstName,
            "stories" :stories,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
} )

module.exports = router