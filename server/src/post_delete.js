const posts = require('../models/posts')
const users = require('../models/users')

const post_delete = function(post_id, user) {
    var success = true
    var flag = false

    for(i=0; i < user.posts.length; i++) {
        if(user.posts[i] == post_id) {
            flag = true
            break
        }
    }

    if(!flag) return false

    posts.findByIdAndDelete(post_id).then((result) => {
        users.findOne({username: result.username}).then((userresult) => {
            userresult.posts.splice(userresult.posts.indexOf(post_id), 1)
            userresult.save()
        }).catch((err) => {
            console.log(err)
            console.log("Error taking post out of user array")
        })
    }).catch((err) => {
        console.log(err)
        success = false
    })

    return success
}

module.exports = post_delete