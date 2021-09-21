// required stuff
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const auth = require('./src/authorize')()
const cors = require('cors')
const flash = require('connect-flash')
const path = require('path')

// routenum for server listen
const routenum = process.env.PORT || 5000

// express app
const app = express()

// middleware and static files
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('tiny'))
app.use(auth.initialize())


// connect to mongodb database
const dbURI = 'mongodb+srv://Forumtest:zarouhikn1@archive.u8juo.mongodb.net/Forum?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then((result) => console.log('Database Online'))
.catch((err) => console.error(err))


const auth_routes = require('./routes/auth_routes')
const user_routes = require('./routes/user_routes')
const post_routes = require('./routes/post_routes')
const comment_routes = require('./routes/comment_routes')
app.use('/login', auth_routes)
app.use('/user', user_routes)
app.use('/post', post_routes)
app.use('/comment', comment_routes)


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../server/public')))


    app.get(/.*/, (req,res) => res.sendFile(__dirname + '/public/index.html'))
}

app.get('/', auth.authenticate(), (req,res) => {
    res.status(200).redirect('/post/new/1')
})

// start the server
app.listen(routenum, () => {
    console.log(`Server is now listening on port ${routenum}`)
})