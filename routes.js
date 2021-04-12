const express = require('express')
const { registerUser, checkUserExists, getHash } = require('./models/userAuth.js')

const router = express.Router()

router.get('/', index)
router.post('/register', register)


// registers a user
async function register(req, res) {
  const username = req.body.username
  const hash = req.body.hash

  const user = {
    username: username,
    hash: hash
  }

  // register user with db
  const result = await registerUser(user)
  if (result) {
    res.send('Success!')
    return
  }

  res.send('Error! Username already taken.')
}

// default index
async function index(req, res) {
  await getHash('john')
  // await checkUserExists('logngnl')
  res.send('hi')
}


module.exports = router