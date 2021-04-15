const monk = require('monk')
const MONGO_CONN_STRING = process.env.URI
const sha256 = require('crypto-js/sha256')
// const bcrypt = require('bcryptjs')
const db = monk(MONGO_CONN_STRING)
const posts = db.get('posts')

/** Makes a post. */
async function makeThread(post) {
  posts.insert(post)
  return true
  // res.send(req.body)
}

/** Gets all threads */
async function getThreads() {
  return await posts.find({})
}

/** Gets a thread*/
async function getThread(id) {
  // console.log(id)
  return await posts.findOne({ _id: id })
}

module.exports = { makeThread, getThreads, getThread }