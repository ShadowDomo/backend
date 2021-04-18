import * as express from 'express';
import loginModel = require('../models/userAuth');

// User login controller
async function loginUser(req: express.Request, res: express.Response) {
  const user = req.body;
  const response = await loginModel.login(user);
  if (response) {
    res.send({sessionID: response});
    return;
  }

  res.send({
    error: 'Invalid username or password',
  });
}

/** Gets the username for the sessionID */
async function getUsername(req: express.Request, res: express.Response) {
  const sessionID: string = req.params.id;
  const username = await loginModel.getUsername(sessionID);

  if (username) {
    res.send({
      username: username,
    });
    return;
  }

  res.send({error: 'Error! No user given by that session ID.'});
}

// registers a user
async function registerUser(req: express.Request, res: express.Response) {
  const user = req.body;
  // register user with db
  const result = await loginModel.registerUser(user);
  if (result) {
    res.send({
      status: 'Success!',
    });
    return;
  }

  res.send({error: 'Error! Username already taken.'});
}

export default {loginUser, registerUser, getUsername};
