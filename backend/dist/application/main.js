"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDefaultCounters = exports.similarMovieHandler = exports.questionPostHandler = exports.questionGetHandler = exports.sessionCheckHandler = void 0;
var optionsCounter_1 = require("./optionsCounter");
var constants_1 = require("./types/constants");
var Storage_1 = __importDefault(require("../storage/Storage"));
var SessionStorage_1 = __importDefault(require("../storage/SessionStorage"));
var types_1 = require("./types/types");
var utils_1 = require("../utils/utils");
var questionFactory_1 = require("./questionFactory");
var answerProcessor_1 = require("./answerProcessor");
var tmdbApi_1 = __importDefault(require("./tmdbApi"));
// Initialize in-mem storage from JSON files on HDD
var movieStorage = new Storage_1.default(process.env.MOVIE_DB_PATH, {
    genres: process.env.GENRES_DB_PATH,
    people: process.env.PEOPLE_DB_PATH,
    production_companies: process.env.PRODUCTION_COMPANIES_DB_PATH,
    keywords: process.env.KEYWORDS_DB_PATH,
});
var allSessionsStorage = new SessionStorage_1.default();
var api = new tmdbApi_1.default();
var defaultOptions = {}; // Needed not to do a full optionsCounter on each session start
// Check session endpoint handler
var sessionCheckHandler = function (sessionData) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, session;
    return __generator(this, function (_a) {
        sessionId = Number(sessionData.sessionId);
        session = allSessionsStorage.getSessionById(sessionId);
        if (!session)
            throw new Error("No session with ID " + sessionId + " was found");
        else
            return [2 /*return*/, { sessionId: "" + sessionId, finished: session.isFinished() }];
        return [2 /*return*/];
    });
}); };
exports.sessionCheckHandler = sessionCheckHandler;
// Question endpoint handlers
var questionGetHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, session, question;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sessionId = allSessionsStorage.createNewSession();
                session = allSessionsStorage.getSessionById(sessionId);
                return [4 /*yield*/, (0, questionFactory_1.questionFactory)(defaultOptions, movieStorage, session)];
            case 1:
                question = _a.sent();
                if (question) {
                    console.log(question);
                    return [2 /*return*/, { sessionId: sessionId, question: question }];
                }
                else
                    return [2 /*return*/, new Error("No question was returned from GET request")];
                return [2 /*return*/];
        }
    });
}); };
exports.questionGetHandler = questionGetHandler;
var questionPostHandler = function (requestData) { return __awaiter(void 0, void 0, void 0, function () {
    var session, sessionResult, sessionResultDetails, possibleForcedQuestionType, resultMovie, resultMovieDetails, question;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                session = allSessionsStorage.getSessionById(Number(requestData.sessionId));
                if (!session) {
                    throw new Error("Unknown session ID " + requestData.sessionId + " in request");
                }
                sessionResult = session.result;
                if (sessionResult) {
                    sessionResultDetails = prepareMovieResult(sessionResult);
                    if (sessionResultDetails) {
                        return [2 /*return*/, { sessionId: session.id, result: sessionResultDetails }];
                    }
                    else
                        return [2 /*return*/, new Error("No movie with ID " + sessionResult + " was found in DB")];
                }
                if ((0, types_1.isAnswerRequest)(requestData)) {
                    console.log(requestData);
                    possibleForcedQuestionType = (0, answerProcessor_1.answerProcessor)(movieStorage, session, requestData.question);
                    if (readyToFinish(session, constants_1.READY_TO_FINISH_THRESHOLD)) {
                        resultMovie = pickResult(session.getMovies());
                        if (resultMovie) {
                            resultMovieDetails = prepareMovieResult(resultMovie.id);
                            if (resultMovieDetails) {
                                session.finishSession(resultMovieDetails.id);
                                return [2 /*return*/, { sessionId: session.id, result: resultMovieDetails }];
                            }
                        }
                        else
                            console.log("No result was picked");
                    }
                }
                return [4 /*yield*/, (0, questionFactory_1.questionFactory)(defaultOptions, movieStorage, session)];
            case 1:
                question = _a.sent();
                if (question)
                    return [2 /*return*/, { sessionId: session.id, question: question }];
                else
                    return [2 /*return*/, new Error("No question was returned from POST request")];
                return [2 /*return*/];
        }
    });
}); };
exports.questionPostHandler = questionPostHandler;
var similarMovieHandler = function (requestData) { return __awaiter(void 0, void 0, void 0, function () {
    var session, sessionResultId, recommendations, _i, recommendations_1, id, movieResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                session = allSessionsStorage.getSessionById(requestData.sessionId);
                if (!session)
                    throw new Error("No session found");
                if (!session.isFinished())
                    throw new Error("Session is not finished");
                if (!session.result)
                    throw new Error("Session is finished, but no result found");
                sessionResultId = session.result;
                return [4 /*yield*/, getRecommendationsFromApi(sessionResultId)];
            case 1:
                recommendations = _a.sent();
                console.log("NUMBER OF RECOMMENDATIONS: " + recommendations.length);
                console.log(recommendations.slice(0, 10));
                for (_i = 0, recommendations_1 = recommendations; _i < recommendations_1.length; _i++) {
                    id = recommendations_1[_i];
                    movieResult = prepareMovieResult(recommendations[Math.floor(Math.random() * recommendations.length)]);
                    if (movieResult) {
                        session.finishSession(id);
                        return [2 /*return*/, { sessionId: session.id, result: movieResult }];
                    }
                }
                throw new Error("No recommendations found");
        }
    });
}); };
exports.similarMovieHandler = similarMovieHandler;
var readyToFinish = function (session, finishThreshold) {
    return session.getMoviesSize() <= finishThreshold;
};
var pickResult = function (arr) {
    var moviesToRandomize = arr.reduce(function (final, current, index) {
        final[index] = Math.floor((current.popularity + 1) * (current.vote_count + 1));
        return final;
    }, {});
    var randomMovieIndex = Number((0, utils_1.weightedRandomizer)(moviesToRandomize));
    return arr[randomMovieIndex];
};
var prepareMovieResult = function (id) {
    var resultMovieDetails = movieStorage.getFullMovieDetailsById(id);
    if (resultMovieDetails) {
        var resultMovieCast = resultMovieDetails.cast
            .slice(0, 20)
            .reduce(function (final, current) {
            var castDetails = movieStorage.getDetailsById("people", current);
            if (castDetails)
                final.push(castDetails.name);
            return final;
        }, [])
            .slice(0, 10);
        var resultMovieDetailsWithCast = __assign(__assign({}, resultMovieDetails), { cast: resultMovieCast });
        return resultMovieDetailsWithCast;
    }
    else
        throw Error("No movie with " + id + " was found");
};
// Initialize default counter once the service is up not to do it for every session
var initializeDefaultCounters = function () { return __awaiter(void 0, void 0, void 0, function () {
    var options;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, optionsCounter_1.optionsCounter)(movieStorage.getAllMovies())];
            case 1:
                options = _a.sent();
                defaultOptions = options;
                return [2 /*return*/];
        }
    });
}); };
exports.initializeDefaultCounters = initializeDefaultCounters;
var getRecommendationsFromApi = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, recommendations;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, api.instance.get("/movie/" + id + "/recommendations?api_key=" + api.key)];
            case 1:
                response = _a.sent();
                recommendations = response.data.results;
                return [2 /*return*/, recommendations.map(function (movie) { return movie.id; })];
        }
    });
}); };
//# sourceMappingURL=main.js.map