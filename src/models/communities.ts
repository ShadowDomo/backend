import {Thread} from './posts';
const monk = require('monk');
const MONGO_CONN_STRING = process.env.URI;
const db = monk(MONGO_CONN_STRING);
const communities: any = db.get('communities');
// const users = db.get('users');

export interface Community {
  communityName: string;
  description: string;
  admins: string;
  date: string;
  creatorUsername: string;
  _id?: string;
}

async function makeThread(communityName: string, threadID: string) {
  const resp = await communities.update(
    {communityName: communityName},
    {$push: {threads: threadID}}
  );
  return resp;
  // TODO error check
}
async function getCommunity(communityName: string) {
  const resp = await communities.findOne(
    {communityName: communityName},
    {
      fields: {
        communityName: 1,
        description: 1,
        date: 1,
        admins: 1,
        creatorUsername: 1,
      },
    }
  );
  return resp;
}

/** Gets all the communities */
async function getCommunities() {
  const resp = await communities.find(
    {},
    {fields: {communityName: 1, description: 1}}
  );
  return resp;
}

/** Retrieves all threads in a given community. */
async function getThreads(communityName: string) {
  const resp = await communities.findOne({communityName: communityName});
  return resp;
}

/** Adds a community. */
async function addCommunity(communityDetails: Community) {
  communityDetails['threads'] = [];
  const resp: Community = await communities.insert(communityDetails);

  return resp;
}

/** Checks if a name is valid.
 *  @return true if valid, false if invalid
 */
async function checkNameValidity(name: string) {
  const resp = await communities.findOne({communityName: name});
  if (resp === null) {
    return true;
  }

  return false;
}

/** removes the specified thread from the community's threads */
async function deleteThread(communityName: string, threadID: string) {
  const resp = await communities.update(
    {communityName: communityName},
    {$pull: {threads: monk.id(threadID)}}
  );
  return resp;
}

export default {
  getThreads,
  deleteThread,
  getCommunities,
  makeThread,
  addCommunity,
  checkNameValidity,
  getCommunity,
};
