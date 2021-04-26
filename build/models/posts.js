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
var monk = require('monk');
var MONGO_CONN_STRING = process.env.URI;
var db = monk(MONGO_CONN_STRING);
var threads = db.get('threads');
/** Makes a post. */
function makePost(post, threadID) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                threads.update({ _id: threadID }, { $push: { posts: post } });
                return [2 /*return*/, true];
            }
            catch (error) {
                console.log(error);
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
/** Deletes specified thread. */
function deleteThread(threadID) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            threads.remove({ _id: threadID });
            return [2 /*return*/, true];
        });
    });
}
/** Makes a thread. */
function makeThread(thread) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            threads.insert(thread);
            return [2 /*return*/, true];
        });
    });
}
/** Gets all threads */
function getThreads() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, threads.find({}, { fields: { posts: 0 } })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/** Gets a thread*/
function getThread(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, threads.findOne({ _id: id })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/** Gets all the posts for parentID */
function getChildrenPosts(parentID) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, threads.findOne({ 'posts.id': parentID }, 'posts.childrenIDs.$')];
                case 1:
                    result = _a.sent();
                    //  posts[0] because findOne above still returns array
                    return [2 /*return*/, result.posts[0].childrenIDs];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/** Appends the child to the parent posts children. */
function updatePostChildren(threadID, parentID, childID) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, threads.update({ _id: threadID, 'posts.id': parentID }, // might be faster
                        { $push: { 'posts.$.childrenIDs': childID } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/** Deletes the specified post by clearing all details and
 * adding a deleted flag.
 */
function deletePost(threadID, postID) {
    return __awaiter(this, void 0, void 0, function () {
        var res, res2, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, threads.update({ _id: threadID, 'posts.id': postID }, { $set: { 'posts.$.content': '' } })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, threads.update({ _id: threadID, 'posts.id': postID }, { $set: { 'posts.$.deleted': true } })];
                case 2:
                    res2 = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/, true];
            }
        });
    });
}
function temp() {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = {
                content: 'g'
            };
            return [2 /*return*/, threads.find(query)];
        });
    });
}
/** Gets the specified post */
function getPost(threadID, postID) {
    return __awaiter(this, void 0, void 0, function () {
        var query, resp, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: threadID, 'posts.id': postID };
                    return [4 /*yield*/, threads.findOne(query, 'posts.$')];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp.posts[0]];
                case 2:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = {
    makeThread: makeThread,
    getThreads: getThreads,
    getPost: getPost,
    getThread: getThread,
    makePost: makePost,
    deleteThread: deleteThread,
    updatePostChildren: updatePostChildren,
    temp: temp,
    getChildrenPosts: getChildrenPosts,
    deletePost: deletePost
};
