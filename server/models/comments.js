const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentsSchema = new mongoose.Schema({
    post_id: Schema.Types.ObjectId,
    username: String,
    body: String,
    like_count: {type: Number, default: 0},
    liked_by: [String],
    disliked_by: [String],
    edited: {type: Boolean, default: false} 
}, {timestamps: true})

const Comment = mongoose.model('Comment', commentsSchema)

module.exports = Comment