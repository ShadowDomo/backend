"use strict";
/* Handles routing for proj*/
// TODO break up when get too big into individual files
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
// const express = require('express');
var posts_1 = require("./controllers/posts");
var login_1 = require("./controllers/login");
var communities_1 = require("./controllers/communities");
var express = require("express");
var router = express.Router();
// Routes
router.post('/', index);
router.get('/getUsername/:id', login_1["default"].getUsername);
router.post('/register', login_1["default"].registerUser);
router.post('/upvotePost', posts_1["default"].upvotePost);
router.post('/getPostVotes', posts_1["default"].getPostVotes);
router.post('/login', login_1["default"].loginUser);
// router.get('/getThreads/:id', postController.getThreads);
router.get('/getThread/:id', posts_1["default"].getThread);
router.post('/makePost', posts_1["default"].makePost);
router.get('/deleteThread/:communityName/:id', posts_1["default"].deleteThread);
router.post('/deletePost', posts_1["default"].deletePost);
router.post('/getPost', posts_1["default"].getPost);
router.get('/getChildrenPosts/:id', posts_1["default"].getChildrenPosts);
router.post('/getUsersVotes', posts_1["default"].getUsersVotes);
router.post('/hidePost', posts_1["default"].hidePost);
router.post('/getHiddenPosts', posts_1["default"].getHiddenPosts);
router.post('/isPostHidden', posts_1["default"].isPostHidden);
// communities routes
router.get('/getThreads/:communityName', communities_1["default"].getThreads);
router.post('/addCommunity', communities_1["default"].addCommunity);
router.post('/updateCommunity', communities_1["default"].updateCommunity);
router.post('/newThread', communities_1["default"].makeThread);
router.get('/getCommunities', communities_1["default"].getCommunities);
router.get('/getCommunity/:name', communities_1["default"].getCommunity);
// TODO use sockets to constantly fetch new posts
// TODO temp for testing
// default index
function index(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // await getHash('john')
            res.send('test');
            return [2 /*return*/];
        });
    });
}
// module.exports = router
exports["default"] = router;
