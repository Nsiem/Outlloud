const comments = require('../models/comments')

const comment_dislike = function(comment_id, user) {
    var likevar = -1

    comments.findById(comment_id).then((result) => {
        if(result.disliked_by.includes(user.username)) {
            result.disliked_by.splice(result.disliked_by.indexOf(user.username), 1)
            result.like_count = result.like_count + 1
            result.save().then().catch((err) => {
                console.log(err)
                console.log("Error disliking comment")
            })
        } else {
            if(result.liked_by.includes(user.username)) {
                result.liked_by.splice(result.liked_by.indexOf(user.username), 1)
                likevar = -2
            }
            result.disliked_by.push(user.username)
            result.like_count = result.like_count + likevar
            result.save().then().catch((err) => {
                console.log(err)
                console.log("Error disliking comment")
            })
        }
    }).catch((err) => {
        console.log(err)
        console.log("Error finding comment")
    })
}

module.exports = comment_dislike