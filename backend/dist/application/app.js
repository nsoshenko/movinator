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
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var main_1 = require("./main");
var dropbox_1 = require("../utils/dropbox");
var optionsCounter_1 = require("./optionsCounter");
var Storage_1 = __importDefault(require("../storage/Storage"));
var SessionStorage_1 = __importDefault(require("../storage/SessionStorage"));
var app = (0, express_1.default)();
var port = 3002;
// Body parsing middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var movieStorage, allSessionsStorage, defaultOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, dropbox_1.downloadStorage)().then(function () {
                    return new Storage_1.default(process.env.MOVIE_DB_PATH, {
                        genres: process.env.GENRES_DB_PATH,
                        people: process.env.PEOPLE_DB_PATH,
                        production_companies: process.env.PRODUCTION_COMPANIES_DB_PATH,
                        keywords: process.env.KEYWORDS_DB_PATH,
                    });
                })];
            case 1:
                movieStorage = _a.sent();
                allSessionsStorage = new SessionStorage_1.default();
                return [4 /*yield*/, (0, optionsCounter_1.optionsCounter)(movieStorage.getAllMovies())];
            case 2:
                defaultOptions = _a.sent();
                try {
                    app.listen(port, function () {
                        console.log("Server is running on port " + port);
                    });
                }
                catch (err) {
                    console.error("Error occured " + err.message);
                }
                app.get("/api/question", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, (0, main_1.questionGetHandler)(allSessionsStorage, defaultOptions, movieStorage)];
                            case 1:
                                response = _a.sent();
                                console.log(response);
                                return [2 /*return*/, res.status(200).send(__assign({}, response))];
                            case 2:
                                err_1 = _a.sent();
                                console.error(err_1);
                                return [2 /*return*/, res.status(500).send("Something went wrong")];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.post("/api/question", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var bodyValidation, response, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                // Log request
                                console.log(req.body.sessionId || "No session ID from React");
                                console.log(req.body.question || "No answer data from React");
                                bodyValidation = Object.keys(req.body);
                                if (bodyValidation.length === 0)
                                    return [2 /*return*/, res.status(500).send("Empty POST request")];
                                if (!bodyValidation.includes("sessionId"))
                                    return [2 /*return*/, res.status(500).send("No session ID in request")];
                                if (Number(req.body.sessionId) <= 0)
                                    return [2 /*return*/, res.status(500).send("Wrong session ID format")];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, main_1.questionPostHandler)(req.body, allSessionsStorage, defaultOptions, movieStorage)];
                            case 2:
                                response = _a.sent();
                                console.log(response);
                                return [2 /*return*/, res.status(200).send(__assign({}, response))];
                            case 3:
                                err_2 = _a.sent();
                                console.error(err_2);
                                return [2 /*return*/, res.status(404).send(err_2)];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.post("/api/check", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Request to check existing session");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, main_1.sessionCheckHandler)(req.body, allSessionsStorage)];
                            case 2:
                                response = _a.sent();
                                console.log(response);
                                return [2 /*return*/, res.status(200).send(__assign({}, response))];
                            case 3:
                                err_3 = _a.sent();
                                console.log(err_3);
                                return [2 /*return*/, res.status(404).send(err_3)];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.post("/api/similar", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Request for similar movie");
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, main_1.similarMovieHandler)(req.body, allSessionsStorage, movieStorage)];
                            case 2:
                                response = _a.sent();
                                console.log(response);
                                return [2 /*return*/, res.status(200).send(__assign({}, response))];
                            case 3:
                                err_4 = _a.sent();
                                console.log(err_4);
                                return [2 /*return*/, res.status(404).send(err_4)];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=app.js.map