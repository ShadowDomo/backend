import * as express from 'express';
import {v4 as uuidv4} from 'uuid';
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
  // post's id
  const uuid = uuidv4();

  // parent ID is the uuid of the parent post
  const parentID = req.body.parentID;

  const threadID = req.body.threadID;

  // update parent to have this post as a child,
  if (parentID) {
    await postModel.updatePostChildren(threadID, parentID, uuid);
  }

  // make this post
  const post: Post = {
    id: uuid,
    username: req.body.username,
    content: req.body.content,
    date: req.body.date,
    childrenIDs: [],
  };
  const response = await postModel.makePost(post, threadID);
  responseHandler(
    response,
    {status: 'Success'},
    {error: 'Failed to update'},
    res
  );
}

/** Retrieves all children posts */
async function getChildrenPosts(req: express.Request, res: express.Response) {
  const parentID = req.params.id;
  const response = await postModel.getChildrenPosts(parentID);
  responseHandler(
    response,
    {childrenIDs: response},
    {error: 'Failed to get child posts'},
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

/** Deletes the specified post. */
async function deletePost(req: express.Request, res: express.Response) {
  const post = req.params.id;
  // const response = await postModel.deleteThread(threadID);
  // res.send('rip' + threadID);
  res.send('deleted');
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

async function temp(req, res) {
  const response = await postModel.temp();
  res.send(response);
}

export default {
  makeThread,
  deleteThread,
  getThreads,
  getThread,
  makePost,
  deletePost,
  temp,
  getChildrenPosts,
};
