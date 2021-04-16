const monk = require('monk');
const MONGO_CONN_STRING = process.env.URI;
const sha256 = require('crypto-js/sha256');
const bcrypt = require('bcryptjs');
const db = monk(MONGO_CONN_STRING);
const users = db.get('users');

// checks if the user exists
async function checkUserExists(username: string) {
  const result = await users.find({username: username});
  if (result.length !== 0) return true;

  return false;
}

// TODO convert to jsdoc
// gets the hash for the given username
async function getHash(username: string): Promise<string> {
  const result = await users.findOne({username: username});

  const hash = result.hash;
  return hash;
}

async function storeAccessToken(username: string, accessToken: string) {
  users.update({username: username}, {$set: {accessToken: accessToken}});
}

// TODO put logic in controller
// logs the user in
async function login(user) {
  const username = user.username;
  const password = user.password;

  if (!(await checkUserExists(username))) return;
  const serverHash = await getHash(username);

  if (await bcrypt.compare(password, serverHash)) {
    // generate session id
    const a = Math.floor(Math.random() * 999999999);
    const accessToken = sha256(a.toString()).toString();

    // store session id in db
    storeAccessToken(username, accessToken);

    return accessToken;
    // return username
  }

  return;
}

// saves the user's credentials
// TODO put checks in controller, model only for insert
async function registerUser(user) {
  // console.log(user.username)
  if (await checkUserExists(user.username)) {
    console.log('user exists');
    return;
  }

  const password = user.password;

  // hash password then insert
  const hash = (await bcrypt.hash(password, 10)).toString();
  users.insert({
    username: user.username,
    hash: hash,
  });
  return true;
}

export {registerUser, checkUserExists, getHash, login};
