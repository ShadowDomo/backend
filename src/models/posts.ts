import {stringify} from 'csv';

const monk = require('monk');
const MONGO_CONN_STRING = process.env.URI;
const db = monk(MONGO_CONN_STRING);
const threads = db.get('threads');

export interface Thread {
  _id?: string;
  username: string;
  title: string;
  content: string;
  posts: Post[];
}

export interface Post {
  username: string;
  content: string;
  date: string;
  id: string;
  childrenIDs: [];
  parentID: string;
  imageURL: string;
}

/** Makes a post. */
async function makePost(post: Post, threadID: string) {
  try {
    threads.update({_id: threadID}, {$push: {posts: post}});
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/** Deletes specified thread. */
async function deleteThread(threadID: string) {
  threads.remove({_id: threadID});
  return true;
}

/** Makes a thread. */
async function makeThread(thread: Thread) {
  threads.insert(thread);
  return true;
  // TODO error check
}

/** Gets all threads */
async function getThreads(): Promise<Thread[]> {
  return await threads.find({}, {fields: {posts: 0}});
  // TODO without the posts too laggy
}

/** Gets a thread*/
async function getThread(id: string) {
  return await threads.findOne({_id: id});
}

/** Gets all the posts for parentID */
async function getChildrenPosts(parentID: string) {
  try {
    const result = await threads.findOne(
      {'posts.id': parentID},
      'posts.childrenIDs.$'
    );

    //  posts[0] because findOne above still returns array
    return result.posts[0].childrenIDs;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/** Appends the child to the parent posts children. */
async function updatePostChildren(
  threadID: string,
  parentID: string,
  childID: string
) {
  try {
    await threads.update(
      {_id: threadID, 'posts.id': parentID}, // might be faster
      {$push: {'posts.$.childrenIDs': childID}}
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/** Deletes the specified post by clearing all details and
 * adding a deleted flag.
 */
async function deletePost(threadID: string, postID: string) {
  try {
    // clear all user data from post
    const res = await threads.update(
      {_id: threadID, 'posts.id': postID},
      {$set: {'posts.$.username': '', 'posts.$.content': ''}}
    );

    // set deleted flag
    const res2 = await threads.update(
      {_id: threadID, 'posts.id': postID},
      {$set: {'posts.$.deleted': true}}
    );
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

async function temp() {
  const query = {
    content: 'g',
  };
  return threads.find(query);
}

export default {
  makeThread,
  getThreads,
  getThread,
  makePost,
  deleteThread,
  updatePostChildren,
  temp,
  getChildrenPosts,
  deletePost,
};
