const loginModel = require('../models/userAuth')


// User login controller
async function loginUser(req, res) {
  const user = req.body
  const response = await loginModel.login(user)
  if (response) {
    res.send({ sessionID: response })
    return
  }

  res.send({
    error: 'Invalid username or password'
  })
}

// registers a user
async function registerUser(req, res) {

  const user = req.body
  // register user with db
  const result = await loginModel.registerUser(user)
  if (result) {
    res.send({
      status: 'Success!'
    })
    return
  }

  res.send({ error: 'Error! Username already taken.' })
}



module.exports = { loginUser, registerUser }