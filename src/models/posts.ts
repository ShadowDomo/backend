const monk = require('monk');
const MONGO_CONN_STRING = process.env.URI;
const db = monk(MONGO_CONN_STRING);
const threads = db.get('threads');
const users = db.get('users');

export interface Thread {
  _id?: string;
  username: string;
  title: string;
  content: string;
  posts: Post[];

  id?: string;
  // stores username: vote_value
  votes: {};
  communityName?: string;
}

export interface Post {
  username: string;
  content: string;
  date: string;
  id: string;
  childrenIDs: [];
  parentID: string;
  imageURL: string;

  // stores username: vote_value
  votes: {};
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

/** Gets the user's vote for the specified post */
async function getUsersVotes(username: string, postID: string) {
  try {
    const resp = await threads.findOne(
      {'posts.id': postID},
      `posts.votes.${username}.$`
    );

    // TODO error handling
    const votes: Object = resp.posts[0].votes;
    if (Object.prototype.hasOwnProperty.call(votes, username)) {
      return votes[username];
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/** Gets the number of votes for a post. */
async function getPostVotes(postID: string) {
  try {
    const resp = await threads.findOne({'posts.id': postID}, 'posts.votes.$');

    // TODO use aggregate later, don't know how currently
    const votes: Object = resp.posts[0].votes;
    let total = 0;
    for (const vote in votes) {
      total += votes[vote];
    }

    return total.toString();
  } catch (error) {
    console.log(error);
    return false;
  }
}

/** Checks if the post is hidden for the given username. */
async function isPostHidden(postID: string, username: string) {
  try {
    const resp = await users.findOne({
      username: username,
      [`hiddenPosts.${postID}`]: true,
    });
    if (resp) return {status: true};

    return {status: false};
  } catch (error) {
    console.log(error);
    return false;
  }
  // return {'1dog': '2'};
}

/** Gets the user's hidden posts. */
async function getHiddenPosts(username: string) {
  try {
    const resp: Object = await users.findOne(
      {username: username},
      'hiddenPosts'
    );
    if (Object.prototype.hasOwnProperty.call(resp, 'hiddenPosts')) {
      return resp['hiddenPosts'];
    }

    return 'no posts';
  } catch (err) {
    console.log(err);
    return err;
  }
}

/** Sets a post to be hidden for a user. */
async function hidePost(username: string, postID: string, hidden: boolean) {
  try {
    if (hidden) {
      const resp = await users.update(
        {username: username},
        {$set: {[`hiddenPosts.${postID}`]: true}}
      );
      return resp;
    }

    const resp = await users.update(
      {username: username},
      {$unset: {[`hiddenPosts.${postID}`]: true}}
    );
    return resp;
  } catch (err) {
    console.log(err);
    return err;
  }
}

/** Returns the threadID for the specified post. */
async function findThreadForPost(postID: string) {
  const resp = await threads.findOne({'posts.id': postID});
  return resp._id.toString();
}

/** Upvotes a post. */
async function upvotePost(postID: string, vote: string, userID: string) {
  try {
    let numVote = parseInt(vote);
    const query = 'posts.$.votes.' + userID;

    // if upvoting when current vote is downvote, then set vote to 0
    const currentVote = await getUsersVotes(userID, postID);
    if (currentVote + numVote === 0) {
      numVote = 0;
    }

    if (currentVote === numVote) {
      numVote = 0;
    }

    const resp = await threads.update(
      {'posts.id': postID},
      {$set: {[query]: numVote}}
    );
    return resp;
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
  const resp = await threads.insert(thread);
  return resp;
  // TODO error check
}

/** Gets all threads */
async function getThreads(): Promise<Thread[]> {
  return await threads.find({}, {fields: {posts: 0}});
  // TODO without the posts too laggy
}

/** Gets a thread and it*/
async function getThread(id: string) {
  return await threads.findOne(
    {_id: id},
    {
      fields: {
        'posts.id': 1,
        username: 1,
        content: 1,
        title: 1,
        'posts.parentID': 1,
      },
    }
  );
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
 * adding a deleted flag. // TODO only allow if you are the owner
 */
async function deletePost(threadID: string, postID: string) {
  try {
    // clear all user data from post
    const res = await threads.update(
      {_id: threadID, 'posts.id': postID},
      {$set: {'posts.$.content': '', 'posts.$.imageURL': ''}} // todo clear image too
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

/** Gets the specified post */
async function getPost(threadID: string, postID: string) {
  try {
    const query = {_id: threadID, 'posts.id': postID};
    const resp = await threads.findOne(query, 'posts.$');

    return resp.posts[0];
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default {
  makeThread,
  getThreads,
  getPost,
  getThread,
  makePost,
  deleteThread,
  updatePostChildren,
  temp,
  upvotePost,
  getChildrenPosts,
  deletePost,
  findThreadForPost,
  getPostVotes,
  getUsersVotes,
  hidePost,
  getHiddenPosts,
  isPostHidden,
};
