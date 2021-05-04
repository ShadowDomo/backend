import * as express from 'express';
import {Socket} from 'socket.io';
import {v4 as uuidv4} from 'uuid';
import postModel from '../models/posts';
import {Post, Thread} from '../models/posts';
// import {connections} from '../socketHandler';

/** Controller for making post */
async function makeThread(req: express.Request, res: express.Response) {
  const thread: Thread = req.body;
  thread.posts = [];
  thread.votes = {};
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
  let parentID = req.body.parentID;
  const threadID = req.body.threadID;

  // update parent to have this post as a child,
  if (parentID !== undefined) {
    await postModel.updatePostChildren(threadID, parentID, uuid);
  } else {
    parentID = null;
  }

  // make this post
  const post: Post = {
    id: uuid,
    username: req.body.username,
    content: req.body.content,
    date: req.body.date,
    childrenIDs: [],
    parentID: parentID,
    imageURL: req.body.imageURL,
    votes: {},
  };
  const response = await postModel.makePost(post, threadID);
  responseHandler(
    response,
    {status: 'Success'},
    {error: 'Failed to update'},
    res
  );

  // broadcast to all users viewing thread
  broadcast(req, 'newPost', post, threadID);
}

function broadcast(
  req: express.Request,
  eventName: string,
  body: any,
  threadID: string
) {
  const app = req.app;
  const io: Socket = app.get('io');
  io.to(threadID).emit(eventName, body);
}

/** Gets the user's vote for the specified post */
async function getUsersVotes(req: express.Request, res: express.Response) {
  const username = req.body.username;
  const postID = req.body.postID;

  const response = await postModel.getUsersVotes(username, postID);
  responseHandler(
    response,
    {username: username, vote: response},
    {error: 'Failed to get users votes.'},
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

/** Gets the number of votes for a post */
async function getPostVotes(req: express.Request, res: express.Response) {
  const postID = req.body.postID;
  const response = await postModel.getPostVotes(postID);
  responseHandler(
    response,
    {votes: response},
    {error: 'failed to register vote.'},
    res
  );
}

/** Gets the user's hidden posts. */
async function getHiddenPosts(req: express.Request, res: express.Response) {
  const username = req.body.username;

  const response = await postModel.getHiddenPosts(username);
  if (response === 'no posts') {
    res.send('no posts');
    return;
  }

  res.send(response);
}

/** Checks if the post is hidden for the given username. */
async function isPostHidden(req: express.Request, res: express.Response) {
  const username = req.body.username;
  const postID = req.body.postID;

  const response = await postModel.isPostHidden(postID, username);
  responseHandler(
    response,
    response,
    {error: 'failed to get post post hidden status'},
    res
  );
}

/** Sets the post to be hidden for the user */
async function hidePost(req: express.Request, res: express.Response) {
  const username = req.body.username;
  const postID = req.body.postID;
  const hidden = req.body.hidden;

  const response = await postModel.hidePost(username, postID, hidden);
  responseHandler(
    response,
    {status: 'success'},
    {error: 'failed to hide post.'},
    res
  );
}

/** Upvotes the specified post. */
async function upvotePost(req: express.Request, res: express.Response) {
  const postID: string = req.body.postID;
  const vote = req.body.vote;
  const userID = req.body.username;

  // find threadID to broadcast to all viewers of thread
  const threadID = await postModel.findThreadForPost(postID);
  const response = await postModel.upvotePost(postID, vote, userID);
  responseHandler(
    response,
    {status: 'Success!'},
    {error: 'failed to register vote.'},
    res
  );

  broadcast(req, 'upvotePost', postID, threadID);
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

/** Gets a post from the server. */
async function getPost(req: express.Request, res: express.Response) {
  const threadID = req.body.threadID;
  const postID = req.body.postID;
  const response = await postModel.getPost(threadID, postID);

  // TODO remove all voter id's
  const votes = await postModel.getPostVotes(postID);
  response.votes = votes;

  responseHandler(response, response, {error: 'Failed to get post.'}, res);
}

/** Deltes the specified thread */
async function deleteThread(req: express.Request, res: express.Response) {
  const threadID = req.params.id;
  const response = await postModel.deleteThread(threadID);
  res.send('rip' + threadID);
}

/** Deletes the specified post. */
async function deletePost(req: express.Request, res: express.Response) {
  const threadID = req.body.threadID;
  const postID = req.body.postID;

  const response = await postModel.deletePost(threadID, postID);
  responseHandler(
    response,
    {status: 'Success!'},
    {error: 'Failed to delete post.'},
    res
  );
}

/** Retrieves a thread */
async function getThread(req, res) {
  // TODO remove votes from thread output, client shouldnt be able to see vote ids
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
  upvotePost,
  makePost,
  getUsersVotes,
  deletePost,
  temp,
  getChildrenPosts,
  getPost,
  getPostVotes,
  hidePost,
  getHiddenPosts,
  isPostHidden,
};
