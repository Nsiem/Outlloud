const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postsSchema = new mongoose.Schema({
    username: String,
    title: String,
    body: String,
    like_count: {type: Number, default: 0},
    liked_by: [String],
    disliked_by: [String],
    comments: [Schema.Types.ObjectId]
}, {timestamps: true})

const Post = mongoose.model('Post', postsSchema)

module.exports = Post