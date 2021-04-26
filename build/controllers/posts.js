"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var uuid_1 = require("uuid");
var posts_1 = require("../models/posts");
/** Controller for making post */
function makeThread(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var thread, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thread = req.body;
                    thread.posts = [];
                    return [4 /*yield*/, posts_1["default"].makeThread(thread)];
                case 1:
                    response = _a.sent();
                    if (response) {
                        res.send({
                            status: 'Success!'
                        });
                        return [2 /*return*/];
                    }
                    res.send({
                        error: 'Failed to make post.'
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/** Generic response handler */
function responseHandler(response, success, failure, res) {
    if (response) {
        res.send(success);
        return;
    }
    res.send(failure);
}
/** Makes a post. */
function makePost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var uuid, parentID, threadID, post, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uuid = uuid_1.v4();
                    parentID = req.body.parentID;
                    threadID = req.body.threadID;
                    if (!(parentID !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, posts_1["default"].updatePostChildren(threadID, parentID, uuid)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    post = {
                        id: uuid,
                        username: req.body.username,
                        content: req.body.content,
                        date: req.body.date,
                        childrenIDs: [],
                        parentID: parentID,
                        imageURL: req.body.imageURL
                    };
                    return [4 /*yield*/, posts_1["default"].makePost(post, threadID)];
                case 3:
                    response = _a.sent();
                    responseHandler(response, { status: 'Success' }, { error: 'Failed to update' }, res);
                    return [2 /*return*/];
            }
        });
    });
}
/** Retrieves all children posts */
function getChildrenPosts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var parentID, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parentID = req.params.id;
                    return [4 /*yield*/, posts_1["default"].getChildrenPosts(parentID)];
                case 1:
                    response = _a.sent();
                    responseHandler(response, { childrenIDs: response }, { error: 'Failed to get child posts' }, res);
                    return [2 /*return*/];
            }
        });
    });
}
//TODO make return recent or add param
/** Returns all posts */
function getThreads(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, posts_1["default"].getThreads()];
                case 1:
                    response = _a.sent();
                    if (response) {
                        res.send(response);
                        return [2 /*return*/];
                    }
                    res.send({
                        error: 'Failed to get posts.'
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/** Gets a post from the server. */
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var threadID, postID, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    threadID = req.body.threadID;
                    postID = req.body.postID;
                    return [4 /*yield*/, posts_1["default"].getPost(threadID, postID)];
                case 1:
                    response = _a.sent();
                    responseHandler(response, response, { error: 'Failed to get post.' }, res);
                    return [2 /*return*/];
            }
        });
    });
}
/** Deltes the specified thread */
function deleteThread(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var threadID, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    threadID = req.params.id;
                    return [4 /*yield*/, posts_1["default"].deleteThread(threadID)];
                case 1:
                    response = _a.sent();
                    res.send('rip' + threadID);
                    return [2 /*return*/];
            }
        });
    });
}
/** Deletes the specified post. */
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var threadID, postID, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    threadID = req.body.threadID;
                    postID = req.body.postID;
                    return [4 /*yield*/, posts_1["default"].deletePost(threadID, postID)];
                case 1:
                    response = _a.sent();
                    responseHandler(response, { status: 'Success!' }, { error: 'Failed to delete post.' }, res);
                    return [2 /*return*/];
            }
        });
    });
}
/** Retrieves a thread */
function getThread(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var threadID, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    threadID = req.params.id;
                    return [4 /*yield*/, posts_1["default"].getThread(threadID)];
                case 1:
                    response = _a.sent();
                    if (response) {
                        res.send(response);
                        return [2 /*return*/];
                    }
                    res.send({
                        error: 'Failed to get posts.'
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function temp(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, posts_1["default"].temp()];
                case 1:
                    response = _a.sent();
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = {
    makeThread: makeThread,
    deleteThread: deleteThread,
    getThreads: getThreads,
    getThread: getThread,
    makePost: makePost,
    deletePost: deletePost,
    temp: temp,
    getChildrenPosts: getChildrenPosts,
    getPost: getPost
};
