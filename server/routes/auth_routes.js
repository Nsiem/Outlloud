const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')
const cfg = require('../src/config')
const users = require('../models/users')
const auth = require('../src/authorize')()
const illegalcharacter = [' ', '<', '>', '#', '%', '"', '{', '}', '|', '\\', '^', '[', ']', "'", ';', '/', '?', ':', '@', '&', '=', '+', '$', ',', '.', '!']

router.get('/', (req, res) => {
    res.status(200).send({message:'Please enter Username and Password.'})
})

router.post('/', (req,res) => {
    if (req.body.username && req.body.password) {
        var datemilli = new Date()

        const payload = {
            username: req.body.username,
            password: req.body.password,
            age: datemilli.getTime()
        }
        users.findOne({username: req.body.username}).then((result) => {
            if (result == null) return res.status(404).send({message: 'Username not found'})
            if (result.password == req.body.password) {
                const userObj = result.toObject()
                delete userObj.password
                const token = jwt.encode(payload, cfg.jwtSecret)
                return res.status(200).json({token: token, user: userObj})

            } else {
                console.log('Incorrect password.')
                return res.status(401).send({message: 'Incorrect password'})
            }
        }).catch((err) => {
            console.log('No user')
            res.status(500).send({message: 'Account not found'})
        })
        
    } else {
        res.status(401).send({message:'Please enter Username and Password'})
    }
})

router.post('/signup', (req, res) => {
    let uname = req.body.username.trim()

    if (uname.length < 5 || uname.length > 20) return res.status(406).send({message:'Username length must be 5-20'})
    if (req.body.password.length < 5) return res.status(406).send({message:'Password must be at least 5 characters'})

    for(let i = 0; i < illegalcharacter.length; i++) {
        if (uname.includes(illegalcharacter[i])) {
            return res.status(406).send({message:'Username contains illegal characters'})
        }
    }

    users.exists({username: uname}).then((result) => {
        const existingUser = result
        
        if (existingUser) {
            res.status(406).send({message:'Username taken'})
        } else {
            const user = new users({
            username: uname,
            password: req.body.password
            })
            
            user.save().then((result) => {
                res.status(200).send({message:'Success!'})
            }).catch((err) => {
                console.error(err)
                res.status(500).send({message:'Error creating new account'})
            })
        } 

    }).catch((err) => {
        console.error(err)
        res.status(500).send({message:"Error"})
    })
     
})

module.exports = router