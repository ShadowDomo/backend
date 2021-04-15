const postModel = require('../models/posts')

/** Controller for making post */
async function makeThread(req, res) {
  const post = req.body
  const response = await postModel.makeThread(post)
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

//TODO make return recent or add param
/** Returns all posts */
async function getThreads(req, res) {
  const response = await postModel.getThreads()
  if (response) {
    res.send(response)
    return
  }

  res.send({
    error: 'Failed to get posts.'
  })

}

/** Retrieves a thread */
async function getThread(req, res) {
  const threadID = req.params.id
  const response = await postModel.getThread(threadID)
  if (response) {
    res.send(response)
    return
  }

  res.send({
    error: 'Failed to get posts.'
  })
}

module.exports = { makeThread, getThreads, getThread }