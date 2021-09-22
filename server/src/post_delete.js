const posts = require('../models/posts')
const users = require('../models/users')

const post_delete = function(post_id) {
    var success = true

    posts.findByIdAndDelete(post_id).then(() => {}).catch((err) => {
        console.log(err)
        success = false
    })

    return success
}

module.exports = post_delete