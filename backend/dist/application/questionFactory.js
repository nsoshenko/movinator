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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionFactory = void 0;
var randomizer_1 = require("../utils/randomizer");
var optionsCounter_1 = require("./optionsCounter");
var constants_1 = require("./types/constants");
var types_1 = require("./types/types");
var tmdbApi_1 = __importDefault(require("./tmdbApi"));
var types_2 = require("../domain/types/types");
var mappings_1 = require("./types/mappings");
var filterPredicates_1 = require("./filterPredicates");
var questionIdCounter = 1; // Needed to generate questionIds
var api = new tmdbApi_1.default();
// Question factory flow
var questionFactory = function (defaultOptions, movieStorage, session) { return __awaiter(void 0, void 0, void 0, function () {
    var notNeededQuestionTypes, options, _a, cleanedOptions, bestCandidates, chosenCandidate, questionDetails, error_1, questionDetailsWithImages, candidateWithDetails, question;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // Check if there are available question types in the pool and reset bans in other case
                if (areAllQuestionsBanned(session, constants_1.QUESTION_TYPE_COUNT))
                    session.resetTempoBannedQuestionTypes();
                notNeededQuestionTypes = session.getAllBannedQuestionTypes();
                if (!session.isMovieStorageEmpty()) return [3 /*break*/, 1];
                _a = defaultOptions;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, (0, optionsCounter_1.optionsCounter)(session.getMovies(), notNeededQuestionTypes)];
            case 2:
                _a = _b.sent();
                _b.label = 3;
            case 3:
                options = _a;
                cleanedOptions = removeBannedOptions(options, session.getBannedQuestionOptions());
                bestCandidates = chooseBestCandidatePerQuestionType(cleanedOptions);
                console.log("BEST CANDIDATES");
                console.log(bestCandidates);
                chosenCandidate = chooseQuestionType(bestCandidates);
                console.log("CHOSEN CANDIDATE");
                console.log(chosenCandidate);
                if (!chosenCandidate) return [3 /*break*/, 10];
                questionDetails = void 0;
                if (!(0, types_1.doesQuestionNeedDetails)(chosenCandidate[0])) return [3 /*break*/, 8];
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, getQuestionDetails(movieStorage, chosenCandidate[0], chosenCandidate[2])];
            case 5:
                questionDetails = _b.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                if (error_1 instanceof Error) {
                    session.banQuestionOption(chosenCandidate[0], error_1.message);
                    console.log("WILL RERUN BECAUSE OF MISSING: " + error_1.message);
                    return [2 /*return*/, (0, exports.questionFactory)(defaultOptions, movieStorage, session)];
                }
                else {
                    console.log("Can't rerun question factory!");
                    console.log(error_1);
                }
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                questionDetails = createOptionNames(chosenCandidate[2]);
                _b.label = 9;
            case 9:
                if (!questionDetails) {
                    session.banQuestionOption(chosenCandidate[0], chosenCandidate[2][0]);
                    session.banQuestionOption(chosenCandidate[0], chosenCandidate[2][1]);
                    console.log("WILL RERUN BECAUSE OF MISSING DETAILS");
                    return [2 /*return*/, (0, exports.questionFactory)(defaultOptions, movieStorage, session)];
                }
                questionDetailsWithImages = questionDetails.map(function (option) {
                    if (!option.imageUrl &&
                        chosenCandidate[0] !== "cast" &&
                        chosenCandidate[0] !== "crew") {
                        option.imageUrl = getBackdropFromInternalStorage(
                        // session.getMovies().length > 0
                        //   ? session.getMovies()
                        movieStorage.getAllMovies(), chosenCandidate[0], option.id);
                    }
                    return option;
                });
                candidateWithDetails = [
                    chosenCandidate[0],
                    chosenCandidate[1],
                    questionDetailsWithImages,
                ];
                console.log("CANDIDATE WITH DETAILS");
                console.log(candidateWithDetails);
                // Ban both used question options
                session.banQuestionOption(chosenCandidate[0], chosenCandidate[2][0]);
                session.banQuestionOption(chosenCandidate[0], chosenCandidate[2][1]);
                question = questionFormatter(candidateWithDetails);
                return [2 /*return*/, question];
            case 10:
                console.log("No question was chosen");
                return [2 /*return*/, undefined];
        }
    });
}); };
exports.questionFactory = questionFactory;
// Question factory helper functions
var areAllQuestionsBanned = function (session, maxNumberOfQuestionTypes) {
    return session.getAllBannedQuestionTypesSize() >= maxNumberOfQuestionTypes;
};
// Removes options, which are contained in banned list in order not to operate with them further
var removeBannedOptions = function (inputOptions, bannedOptions) {
    // Check if there is any option to ban
    if (Object.keys(bannedOptions).length === 0) {
        console.log("No options to ban");
        return inputOptions;
    }
    // Copy inputOptions array and remove all intersections with banned
    var cleanedOptions = Object.entries(inputOptions).reduce(function (final, _a) {
        var optionType = _a[0], options = _a[1];
        if (!bannedOptions[optionType])
            return final;
        var optionValues = Object.keys(options);
        for (var _i = 0, optionValues_1 = optionValues; _i < optionValues_1.length; _i++) {
            var value = optionValues_1[_i];
            if (bannedOptions[optionType].has(value) && final[optionType])
                delete final[optionType][value];
        }
        // Remove object for optionType if no options left inside
        if (final[optionType]) {
            if (Object.keys(final[optionType]).length === 0) {
                console.log("All options from type " + optionType + " were removed");
                delete final[optionType];
            }
        }
        return final;
    }, inputOptions);
    return cleanedOptions;
};
var chooseBestCandidatePerQuestionType = function (options) {
    var candidates = Object.entries(options).reduce(function (final, _a) {
        var optionType = _a[0], optionValues = _a[1];
        var chosenOptions = [];
        var optionValuesKeys = Object.keys(optionValues);
        if (optionValuesKeys.length < 2)
            return final;
        else if (optionValuesKeys.length === 2) {
            chosenOptions.push.apply(chosenOptions, [optionValuesKeys[0], optionValuesKeys[1]]);
        }
        else if (optionValuesKeys.length > 2) {
            var randomOptionOne = (0, randomizer_1.weightedRandomizer)(optionValues);
            do {
                var randomOptionTwo = (0, randomizer_1.weightedRandomizer)(optionValues);
            } while (randomOptionOne === randomOptionTwo);
            chosenOptions.push.apply(chosenOptions, [randomOptionOne, randomOptionTwo]);
        }
        if (chosenOptions.length === 2) {
            var typeWeight = optionValues[chosenOptions[0]] + optionValues[chosenOptions[1]];
            final.push([optionType, typeWeight, chosenOptions]);
        }
        return final;
    }, []);
    return candidates;
};
var chooseQuestionType = function (candidates) {
    if (candidates.length === 0) {
        console.log("No candidates to choose from");
        return undefined;
    }
    if (candidates.length === 1) {
        return candidates[0];
    }
    var optionsToRandomize = {};
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        optionsToRandomize[candidate[0]] = candidate[1];
    }
    var randomOption = (0, randomizer_1.weightedRandomizer)(optionsToRandomize);
    var chosenOption = candidates.find(function (candidate) { return candidate[0] === randomOption; });
    console.log("Randomly chosen option: " + chosenOption);
    return chosenOption;
};
var getQuestionDetails = function (movieStorage, type, options) { return __awaiter(void 0, void 0, void 0, function () {
    var optionPromises, detailedOptions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("NEED TO GET DETAILS");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                optionPromises = options.map(function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getOptionDetailsWithFallback(movieStorage, type, id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); });
                return [4 /*yield*/, Promise.all(optionPromises)];
            case 2:
                detailedOptions = _a.sent();
                return [2 /*return*/, detailedOptions];
            case 3:
                error_2 = _a.sent();
                throw error_2;
            case 4: return [2 /*return*/];
        }
    });
}); };
// Wraps fallback mechanism querying API after in-mem storage if needed
var getOptionDetailsWithFallback = function (movieStorage, type, id) { return __awaiter(void 0, void 0, void 0, function () {
    var storageLabel, optionDetails, error_3, endpoint, optionDetails, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 7]);
                storageLabel = type === "cast" || type === "crew" ? "people" : type;
                return [4 /*yield*/, getOptionDetailsFromInternalStorage(movieStorage, storageLabel, id)];
            case 1:
                optionDetails = _a.sent();
                if ((0, types_2.isPersonDetails)(optionDetails) && optionDetails.profile_path !== null)
                    return [2 /*return*/, {
                            id: optionDetails.id,
                            name: optionDetails.name,
                            imageUrl: optionDetails.profile_path,
                        }];
                else if ((0, types_2.isGenreDetails)(optionDetails))
                    return [2 /*return*/, {
                            id: optionDetails.id,
                            name: optionDetails.name,
                            imageUrl: optionDetails.backdrop_path[Math.floor(Math.random() * optionDetails.backdrop_path.length)],
                        }];
                return [2 /*return*/, { id: optionDetails.id, name: optionDetails.name }];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                endpoint = mappings_1.questionTypeToEndpoint[type];
                return [4 /*yield*/, getOptionDetailsFromApi(type, endpoint, id)];
            case 4:
                optionDetails = _a.sent();
                if (optionDetails) {
                    if ((0, types_2.isPersonDetails)(optionDetails) &&
                        optionDetails.profile_path !== null)
                        return [2 /*return*/, {
                                id: optionDetails.id,
                                name: optionDetails.name,
                                imageUrl: optionDetails.profile_path,
                            }];
                    return [2 /*return*/, { id: optionDetails.id, name: optionDetails.name }];
                }
                return [3 /*break*/, 6];
            case 5:
                error_4 = _a.sent();
                console.log(error_4);
                throw Error(id);
            case 6: return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// Queries details of entity by ID from in-mem storage (rejects promise in case of failure)
var getOptionDetailsFromInternalStorage = function (movieStorage, storageLabel, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var optionDetails = movieStorage.getDetailsById(storageLabel, id);
                if (optionDetails)
                    resolve(optionDetails);
                else
                    reject("Can't find details for " + storageLabel + ": " + id + " in internal storage");
            })];
    });
}); };
// Queries details of entity by ID from API in case it's missing in in-mem storage
var getOptionDetailsFromApi = function (type, endpoint, optionId) { return __awaiter(void 0, void 0, void 0, function () {
    var requestUrl, response, optionDetails, error_5, requestUrl, response, optionDetails, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(type === "genres")) return [3 /*break*/, 5];
                requestUrl = endpoint + "?api_key=" + api.key;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, api.instance.get(requestUrl)];
            case 2:
                response = _a.sent();
                optionDetails = response.data[Object.keys(response.data)[0]].find(function (_a) {
                    var id = _a.id;
                    return id.toString() === optionId;
                });
                if (optionDetails)
                    return [2 /*return*/, optionDetails];
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                throw error_5;
            case 4: return [3 /*break*/, 9];
            case 5:
                requestUrl = endpoint + "/" + optionId + "?api_key=" + api.key;
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, api.instance.get(requestUrl)];
            case 7:
                response = _a.sent();
                optionDetails = response.data;
                return [2 /*return*/, optionDetails];
            case 8:
                error_6 = _a.sent();
                throw error_6;
            case 9: return [2 /*return*/];
        }
    });
}); };
var createOptionNames = function (options) {
    return options.map(function (option) {
        return {
            id: option,
            name: option,
        };
    });
};
var getBackdropFromInternalStorage = function (inputArr, type, id) {
    console.log("GETTING BACKDROP FOR " + id + " OF " + type);
    var movies = inputArr
        .filter((0, filterPredicates_1.isPropertyWithImages)(mappings_1.questionTypeToMovieProperty[type], id))
        .sort(function (a, b) { return b.vote_average - a.vote_average; })
        .slice(0, 1000);
    var randomMovie = movies[Math.floor(Math.random() * movies.length)];
    console.log(randomMovie);
    return randomMovie ? randomMovie.backdrop_path : undefined;
};
var questionFormatter = function (candidate) {
    var question = {
        id: generateQuestionId(),
        type: candidate[0],
        options: [
            candidate[2][0],
            candidate[2][1],
            { id: 0, name: "Other" },
        ],
    };
    for (var _i = 0, _a = question.options; _i < _a.length; _i++) {
        var option = _a[_i];
        option.selected = false;
    }
    return question;
};
// Increments and returns global variable questionId
var generateQuestionId = function () { return questionIdCounter++; };
// const doesQuestionNeedDetails = (type: QuestionType): boolean => {
//   const needDetails = [
//     "genres",
//     "cast",
//     "crew",
//     "production_companies",
//     "keywords",
//   ];
//   return needDetails.includes(type);
// };
//# sourceMappingURL=questionFactory.js.map