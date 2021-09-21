const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    posts: [Schema.Types.ObjectId],
    comments: [Schema.Types.ObjectId]
}, {timestamps: true})

const User = mongoose.model('User', usersSchema)

module.exports = User