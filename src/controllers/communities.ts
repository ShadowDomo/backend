import * as express from 'express';
import communitiesModel, {Community} from '../models/communities';
import postModel from '../models/posts';
import {Thread} from '../models/posts';
import {broadcast} from './broadcast';

/** Retrieves threads for a given community. */
async function getThreads(req: express.Request, res: express.Response) {
  const communityName = req.params.communityName;
  const resp = await communitiesModel.getThreads(communityName);

  if (!resp) {
    res.send({error: "Community doesn't exist"});
    return;
  }
  res.send(resp);
}

/** Gets the community specified by the community name. */
async function getCommunity(req: express.Request, res: express.Response) {
  const communityName = req.params.name;
  const resp = await communitiesModel.getCommunity(communityName);
  if (resp) {
    res.send(resp);
    return;
  }

  res.send({error: 'No community known by that name.'});
}

/** Retrieves all the communities */
async function getCommunities(req: express.Request, res: express.Response) {
  const resp = await communitiesModel.getCommunities();
  res.send(resp);
}

/** Makes a thread. */
async function makeThread(req: express.Request, res: express.Response) {
  const thread: Thread = req.body;
  thread.posts = [];
  thread.votes = {};
  const communityName: string = req.body.communityName;

  // make thread in threads collection
  const postResp: Thread = await postModel.makeThread(thread);

  // add threadID to community's threads
  const resp = await communitiesModel.makeThread(communityName, postResp._id);
  broadcast(req, 'newThread', thread, thread.communityName);
  res.send(resp);
}

/** Adds a community */
async function addCommunity(req: express.Request, res: express.Response) {
  const communityDetails: Community = req.body;

  // name invalid
  if (!(await checkNameValidity(communityDetails.communityName))) {
    res.send({error: 'Community name already in use.'});
    return;
  }

  communityDetails.admins = [
    ...communityDetails.admins,
    communityDetails.creatorUsername,
  ];

  const response = await communitiesModel.addCommunity(communityDetails);
  res.send(response);
  return;
}

/** Checks if a community name is not taken. */
async function checkNameValidity(name: string) {
  if (!(await communitiesModel.checkNameValidity(name))) {
    return false;
  }

  return true;
}

export default {
  getThreads,
  addCommunity,
  makeThread,
  getCommunities,
  getCommunity,
};
