const monk = require('monk');
const MONGO_CONN_STRING = process.env.URI;
const db = monk(MONGO_CONN_STRING);
const posts = db.get('posts');

interface Thread {
  username: string;
  title: string;
  content: string;
}

/** Makes a post. */
async function makeThread(thread: Thread) {
  posts.insert(thread);
  return true;
  // res.send(req.body)
}

/** Gets all threads */
async function getThreads() {
  return await posts.find({});
}

/** Gets a thread*/
async function getThread(id: string) {
  // console.log(id)
  return await posts.findOne({_id: id});
}

export default {makeThread, getThreads, getThread};
