const posts = require('../models/posts')

const liked = (req,res,next) => {
    var likevar = 1

    posts.findById(req.params.post_id).then((result) => {
        if(result.liked_by.includes(req.user.username)) {
            result.liked_by.splice(result.liked_by.indexOf(req.user.username), 1)
            result.like_count = result.like_count - 1
            result.save().then((postresult) => {
                res.status(200).send(postresult)
            }).catch((err) => {
                console.log(err)
                res.status(500).send({message:"Error unliking post"})
            })
        } else {
            if(result.disliked_by.includes(req.user.username)) {
                result.disliked_by.splice(result.disliked_by.indexOf(req.user.username), 1)
                likevar = 2
            }
            result.liked_by.push(req.user.username)
            result.like_count = result.like_count + likevar
            result.save().then((postresult) => {
                res.status(200).send(postresult)
            }).catch((err) => {
                console.log(err)
                res.status(500).send({message:"Error liking post"})
            })
        }
    }).catch((err) => {
        console.log(err)
        res.status(500).send({message:"Error retrieving post"})
    })
}
module.exports = liked