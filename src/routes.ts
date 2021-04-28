/* Handles routing for proj*/
// TODO break up when get too big into individual files

// const express = require('express');
import postController from './controllers/posts';
import loginController from './controllers/login';
import * as express from 'express';
const router = express.Router();

// Routes
router.get('/', index);
router.get('/getUsername/:id', loginController.getUsername);
router.post('/register', loginController.registerUser);
router.post('/upvotePost', postController.upvotePost);
router.post('/getPostVotes', postController.getPostVotes);
router.post('/login', loginController.loginUser);
router.post('/newThread', postController.makeThread);
router.get('/getThreads', postController.getThreads);
router.get('/getThread/:id', postController.getThread);
router.post('/makePost', postController.makePost);
router.get('/deleteThread/:id', postController.deleteThread);
router.post('/deletePost', postController.deletePost);
router.post('/getPost', postController.getPost);
router.get('/getChildrenPosts/:id', postController.getChildrenPosts);

// TODO use sockets to constantly fetch new posts
// TODO temp for testing
// default index
async function index(req: express.Request, res: express.Response) {
  // await getHash('john')

  res.send('test');
}

// module.exports = router
export default router;
