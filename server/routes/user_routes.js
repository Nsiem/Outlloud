const express = require('express')
const router = express.Router()
const users = require('../models/users')
const comment_delete = require('../src/comment_delete')
const post_delete = require('../src/post_delete')
const auth = require('../src/authorize')()

router.get('/:username', auth.authenticate(), (req,res) => {
    users.findOne({username: req.params.username}).select('-password').lean().then((result) => {
        if(result == null) return res.status(404).send({message:"User does not exist"})
        res.status(200).json(result)
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error finding user info"})
    })
})

router.put('/:username/bioupdate', auth.authenticate(), (req,res) => {
    const newbio = req.body.bio
    users.findByIdAndUpdate(req.user._id, {bio: newbio}, {new: true, lean: true, select: "-password"}).then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        console.error(err)
        res.status(500).send({message:"Error updating bio"})
    })


})

router.delete('/:username/delete', auth.authenticate(), (req,res) => {
    for(i = 0; i < req.user.comments.length; i++) {
        comment_delete(req.user.comments[i], req.user)
    }

    for(i = 0; i < req.user.posts.length; i++) {
        post_delete(req.user.posts[i], req.user)
    }

    users.findByIdAndDelete(req.user._id).then(() => {
        res.status(200).send({message:"Account successfully deleted"})
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error deleting account"})
    })
})

module.exports = router