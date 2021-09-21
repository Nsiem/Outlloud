const express = require('express')
const router = express.Router()
const comments = require('../models/comments')
const posts = require('../models/posts')
const users = require('../models/users')
const comment_like = require('../src/comment_like')
const comment_dislike = require('../src/comment_dislike')
const comment_delete = require('../src/comment_delete')
const auth = require('../src/authorize')()

router.post('/:post_id/addcomment', auth.authenticate(), (req,res) => {
    if(req.body.commentbody.length == 0) return res.status(405).send({message:"Comment must not be empty"})

    const newcomment = new comments
    newcomment.post_id = req.params.post_id
    newcomment.username = req.user.username
    newcomment.body = req.body.commentbody
    
    newcomment.save().then((result) => {
        posts.findByIdAndUpdate(req.params.post_id, {$push: {comments: result._id}}).catch((err) => {
            console.log(err)
            return res.status(500).send({message:"Error adding comment to post"})
        })
        users.findByIdAndUpdate(req.user._id, {$push: {comments: result._id}}).then((userresult) => {
            return res.status(200).send(result._id)
        }).catch((err) => {
            console.log(err)
            return res.status(500).send({message:"Error saving comment to user"})
        })
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({message:"Error occured saving comment"})
    })
})

router.get('/:comment_id', auth.authenticate(), (req,res) => {
    comments.findById(req.params.comment_id).then((result) => {res.status(200).send(result)})
    .catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error retrieving comment"})
    })
})

router.get('/allcommentspost/:post_id', auth.authenticate(), (req,res) => {
    comments.find({post_id: req.params.post_id}).sort({createdAt: -1}).then((result) => {res.status(200).send(result)})
    .catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error retrieving comments"})
    })
})

router.get('/allcommentsuser/:username', auth.authenticate(), (req,res) => {
    comments.find({username: req.params.username}).sort({createdAt: -1}).then((result) => {res.status(200).send(result)})
    .catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error retrieving comments"})
    })
})

router.put('/:comment_id/edit', auth.authenticate(), (req,res) => {
    const newcomment = req.body.commentbody
    var flag = false

    for(i=0; i < req.user.comments.length; i++) {
        if(req.user.comments[i] == req.params.comment_id) {
            flag = true
            break
        }
    }
    if(!flag) return res.status(403).send({message:"Cannot edit comment"})

    comments.findByIdAndUpdate(req.params.comment_id, {body: newcomment, edited: true}, {new: true}).then((result) => {res.status(200).send(result)})
    .catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error editing comment"})
    })
})

router.delete('/:comment_id', auth.authenticate(), (req,res) => {
    const success = comment_delete(req.params.comment_id, req.user)
    if(success == true) return res.status(200).send({message:"Comment deleted"})
    res.status(500).send({message:"Error deleting comment"})
})

router.put('/:comment_id/like', auth.authenticate(), (req,res) => {
    comment_like(req.params.comment_id, req.user)
    res.status(200).send({message:"Comment liked"})
})

router.put('/:comment_id/dislike', auth.authenticate(), (req,res) => {
    comment_dislike(req.params.comment_id, req.user)
    res.status(200).send({message:"Comment disliked"})
})

module.exports = router