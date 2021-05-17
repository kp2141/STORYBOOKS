const express = require('express')
const router  = express.Router()
const {ensureAuth} = require("../middleware/auth")
const story = require('../models/Story')

// @desc Show add page
// @route GET / stories/add
router.get("/add",ensureAuth, (req,res) => {
    res.render('stories/add')
} )
// @desc Process add form
// @route POST / stories
router.post("/",ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        await story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
} )

// @desc Show all stories
// @route GET / stories/add
router.get("/",ensureAuth, async (req,res) => {
    try {
        const stories = await story.find({status:'public'}).populate('user').sort({createdAt:'desc'}).lean()
        res.render('stories/index',{
            stories,
        })
    } catch (err) {
        console.error(err)
        
    }
} )

// @desc show single
// @route GET / stories/:id
router.get("/:id",ensureAuth, async (req,res) => {
    try {
        let Story =  await story.findById(req.params.id).populate('user').lean()
        if (!Story){
            return res.render('error/404')
        }
        res.render('stories/show', {
            Story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
    
} )
// @desc edit stories
// @route GET / edit/:id

router.get("/edit/:id",ensureAuth, async (req,res) => {
    const Story = await story.findOne({
        _id: req.params.id
    }).lean()

    if (!Story){
        return res.render('error/404')
    }
    if (Story.user != req.user.id){
        res.redirect('/stories')
    }else{
        res.render('stories/edit', {
            Story,
        })
    }
} )

// @desc Update story
// @route PUT / stories/ :id
router.put("/:id",ensureAuth, async (req,res) => {
    try {
        let Story  = await story.findById(req.params.id).lean()

    if (!Story){
        return res.render('error/404')
    }
    if (Story.user != req.user.id){
        res.redirect('/stories')
    }else{
       Story = await story.findOneAndUpdate({_id: req.params.id}, req.body,{
           new: true,
           runValidators: true
       })

       res.redirect('/dashboard')
    }
    } catch (err) {
        console.error(err)
        return res.render(error/500)
    }
} )

// @desc Delete the page
// @route DELETE / stories/:id
router.delete("/:id",ensureAuth, async(req,res) => {
    try {
        let Story  = await story.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }

} )

// @desc User stories
// @route GET / stories/user/:userId
router.get("/user/:userId",ensureAuth,async (req,res) => {
    try {
       const stories = await story.find({
          user: req.params.userId,
          status:'public'
       }).populate('user').lean() 

       res.render('stories/index',{
           stories
       })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
} )



module.exports = router