/* Handles routing for proj*/
// TODO break up when get too big into individual files

const express = require('express')
const { registerUser, checkUserExists, getHash, login } = require('./models/userAuth.js')

const router = express.Router()

// Routes
router.get('/', index)
router.post('/register', register)
router.post('/login', loginUserController)


// TODO temp 
// default index
async function index(req, res) {
  await getHash('john')
  res.send('hi')
}

// User login controller
async function loginUserController(req, res) {
  const user = req.body
  const result = await login(user)
  if (result) {
    res.send({ sessionID: result })
    return
  }

  res.send({
    error: 'Wrong username or password'
  })
}

// registers a user
async function register(req, res) {

  const user = req.body
  // register user with db
  const result = await registerUser(user)
  if (result) {
    res.send('Success!')
    return
  }

  res.send('Error! Username already taken.')
}


module.exports = router