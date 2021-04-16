import * as express from 'express';
import postModel from '../models/posts';

/** Controller for making post */
async function makeThread(req: express.Request, res: express.Response) {
  const thread = req.body;
  const response = await postModel.makeThread(thread);
  if (response) {
    res.send({
      status: 'Success!',
    });
    return;
  }

  res.send({
    error: 'Failed to make post.',
  });
}

//TODO make return recent or add param
/** Returns all posts */
async function getThreads(req, res) {
  const response = await postModel.getThreads();
  if (response) {
    res.send(response);
    return;
  }

  res.send({
    error: 'Failed to get posts.',
  });
}

/** Retrieves a thread */
async function getThread(req, res) {
  const threadID = req.params.id;
  const response = await postModel.getThread(threadID);
  if (response) {
    res.send(response);
    return;
  }

  res.send({
    error: 'Failed to get posts.',
  });
}

export default {makeThread, getThreads, getThread};
