/* Handles routing for proj*/
// TODO break up when get too big into individual files

const express = require('express')
const { registerUser, checkUserExists, getHash, login } = require('./models/userAuth.js')
const { makePost } = require('./models/posts')

const router = express.Router()

// Routes
router.get('/', index)
router.post('/register', register)
router.post('/login', loginUserController)
router.post('/newPost', makePostController)

// TODO use sockets to constantly fetch new posts
// TODO temp 
// default index
async function index(req, res) {
  await getHash('john')
  res.send('hi')
}


/** Controller for making post */
async function makePostController(req, res) {
  const post = req.body
  const response = await makePost(post)
  if (response) {
    res.send({
      status: 'Success!'
    })
    return
  }

  res.send({
    error: 'Failed to make post.'
  })
}

// User login controller
async function loginUserController(req, res) {
  const user = req.body
  const response = await login(user)
  if (response) {
    res.send({ sessionID: response })
    return
  }

  res.send({
    error: 'Invalid username or password'
  })
}

// registers a user
async function register(req, res) {

  const user = req.body
  // register user with db
  const result = await registerUser(user)
  if (result) {
    res.send({
      status: 'Success!'
    })
    return
  }

  res.send({ error: 'Error! Username already taken.' })
}


module.exports = router