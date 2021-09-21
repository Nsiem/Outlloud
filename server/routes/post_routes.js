const express = require('express')
const router = express.Router()
const posts = require('../models/posts')
const users = require('../models/users')
const post_delete = require('../src/post_delete')
const disliked = require('../src/post_dislike')
const liked = require('../src/post_like')
const auth = require('../src/authorize')()

function pageslices(pagenum) {
    if (pagenum == 1) return 0
    pagenum = ((pagenum - 1) * 10)
    return pagenum
}

router.post('/createpost', auth.authenticate(), (req,res) => {
    if(req.body.title.length == 0) return res.status(405).send({message:"Title must not be empty"})
    if(req.body.title.length > 108) return res.status(405).send({message:"Title cannot be greater than 100 characters"})

    const newpost = new posts
    newpost.username = req.user.username
    newpost.title = req.body.title
    newpost.body = req.body.postbody
    
    newpost.save().then((result) => {
        users.findByIdAndUpdate(req.user._id, {$push: {posts: result._id}}).then((userresult) => {
            res.status(200).send(result._id)
        }).catch((err) => {
            console.log(err)
            res.status(500).send({message:"Error saving post to user"})
        })
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error occured saving post"})
    })
})

router.put('/:post_id/like', auth.authenticate(), (req,res) => {
    liked(req,res)
})

router.put('/:post_id/dislike', auth.authenticate(), (req,res) => {
    disliked(req,res)
})


router.get('/:post_id', auth.authenticate(), (req,res) => {
    posts.findById(req.params.post_id).then((result) => {
        if (result == null) return res.status(404).send({message:"Post not found"})
        console.log('post was found')
        res.status(200).json(result)
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error getting post data"})
    })
})

router.get('/popular/:pagenum', auth.authenticate(), (req,res) => {
    const pages = pageslices(req.params.pagenum)
    posts.find({}).skip(pages).limit(10).sort({like_count: -1}).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error retrieving posts"})
    })
})

router.get('/new/:pagenum', auth.authenticate(), (req,res) => {
    const pages = pageslices(req.params.pagenum)
    posts.find({}).skip(pages).limit(10).sort({createdAt: -1}).then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error retrieving posts"})
    })
})

router.delete('/:post_id', auth.authenticate(), (req,res) => {
    const success = post_delete(req.params.post_id, req.user)
    if(success == true) return res.status(200).send({message:"Post deleted"})
    res.status(500).send({message:"Error deleting post"})
})

module.exports = router