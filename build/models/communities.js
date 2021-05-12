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
var communities = db.get('communities');
/** Updates a community. */
function updateCommunity(communityName, description, admins) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.update({ communityName: communityName }, { $set: { description: description, admins: admins } })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
function makeThread(communityName, threadID) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.update({ communityName: communityName }, { $push: { threads: threadID } })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
function getCommunity(communityName) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.findOne({ communityName: communityName }, {
                        fields: {
                            communityName: 1,
                            description: 1,
                            date: 1,
                            admins: 1,
                            creatorUsername: 1
                        }
                    })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
/** Gets all the communities */
function getCommunities() {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.find({}, { fields: { communityName: 1, description: 1 } })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
/** Retrieves all threads in a given community. */
function getThreads(communityName) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.findOne({ communityName: communityName })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
/** Adds a community. */
function addCommunity(communityDetails) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    communityDetails['threads'] = [];
                    return [4 /*yield*/, communities.insert(communityDetails)];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
/** Checks if a name is valid.
 *  @return true if valid, false if invalid
 */
function checkNameValidity(name) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.findOne({ communityName: name })];
                case 1:
                    resp = _a.sent();
                    if (resp === null) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
/** removes the specified thread from the community's threads */
function deleteThread(communityName, threadID) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, communities.update({ communityName: communityName }, { $pull: { threads: monk.id(threadID) } })];
                case 1:
                    resp = _a.sent();
                    return [2 /*return*/, resp];
            }
        });
    });
}
exports["default"] = {
    getThreads: getThreads,
    deleteThread: deleteThread,
    getCommunities: getCommunities,
    makeThread: makeThread,
    addCommunity: addCommunity,
    checkNameValidity: checkNameValidity,
    getCommunity: getCommunity,
    updateCommunity: updateCommunity
};
