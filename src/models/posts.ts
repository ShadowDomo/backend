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
}

/** Makes a post. */
async function makePost(post: Post, threadID: string) {
  try {
    threads.update({_id: threadID}, {$push: {posts: post}});
    return true;
  } catch (error) {
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

export default {makeThread, getThreads, getThread, makePost, deleteThread};
