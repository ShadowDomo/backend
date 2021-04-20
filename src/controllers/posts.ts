import * as express from 'express';
import postModel from '../models/posts';
import {Post, Thread} from '../models/posts';

/** Controller for making post */
async function makeThread(req: express.Request, res: express.Response) {
  const thread: Thread = req.body;
  thread.posts = [];
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

/** Generic response handler */
function responseHandler(response, success, failure, res: express.Response) {
  if (response) {
    res.send(success);
    return;
  }

  res.send(failure);
}

/** Makes a post. */
async function makePost(req: express.Request, res: express.Response) {
  const post: Post = {
    username: req.body.username,
    content: req.body.content,
    date: req.body.date,
  };

  const threadID = req.body.threadID;
  const response = await postModel.makePost(post, threadID);
  responseHandler(
    response,
    {status: 'Success'},
    {error: 'Failed to update'},
    res
  );
}

//TODO make return recent or add param
/** Returns all posts */
async function getThreads(req: express.Request, res: express.Response) {
  const response = await postModel.getThreads();
  if (response) {
    res.send(response);
    return;
  }

  res.send({
    error: 'Failed to get posts.',
  });
}

/** Deltes the specified thread */
async function deleteThread(req: express.Request, res: express.Response) {
  const threadID = req.params.id;
  const response = await postModel.deleteThread(threadID);
  res.send('rip' + threadID);
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

export default {makeThread, deleteThread, getThreads, getThread, makePost};
