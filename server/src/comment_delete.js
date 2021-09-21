const comments = require('../models/comments')
const posts = require('../models/posts')
const users = require('../models/users')

const comment_delete = function(comment_id, user) {
    var success = true
    var flag = false

    for(i=0; i < user.comments.length; i++) {
        if(user.comments[i] == comment_id) {
            flag = true
            break
        }
    }

    if(!flag) return false

    comments.findByIdAndDelete(comment_id).then((result) => {
        posts.findById(result.post_id).then((postresult) => {
            postresult.comments.splice(postresult.comments.indexOf(comment_id), 1)
            postresult.save()
        }).catch((err) => {
            console.log(err)
            console.log("Error taking comment out of post")
        })
        users.findOne({username: result.username}).then((userresult) => {
            userresult.comments.splice(userresult.comments.indexOf(comment_id), 1)
            userresult.save()
        }).catch((err) => {
            console.log(err)
            console.log("Error taking comment out of user array")
        })
    }).catch((err) => {
        console.log(err)
        success = false
    })

    return success
}

module.exports = comment_delete