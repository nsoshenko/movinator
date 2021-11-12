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
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsCounter = void 0;
var constants_1 = require("./types/constants");
// Counts how many times each id of each entity encounters in global or session storage
// Can be simplified by passing notNeededTypes to ignore
var optionsCounter = function (inputArr, notNeededTypes) {
    if (notNeededTypes === void 0) { notNeededTypes = new Set(); }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var options = inputArr.reduce(function (final, current) {
                        // Count years (~160 ms)
                        if (current.release_date && !notNeededTypes.has("years")) {
                            var year = new Date(current.release_date).getFullYear();
                            if (!final.years)
                                final.years = {};
                            if (!final.years[year])
                                final.years[year] = 0;
                            final.years[year]++;
                        }
                        // Count ratings (~1 ms)
                        if (current.vote_average && !notNeededTypes.has("ratings")) {
                            if (current.vote_count >= constants_1.MIN_VOTE_COUNT_FOR_RATING) {
                                var rating = Math.floor(current.vote_average);
                                if (!final.ratings)
                                    final.ratings = {};
                                if (!final.ratings[rating])
                                    final.ratings[rating] = 0;
                                final.ratings[rating]++;
                            }
                        }
                        // Count languages (~8 ms)
                        if (current.original_language && !notNeededTypes.has("languages")) {
                            var language = current.original_language;
                            if (!final.languages)
                                final.languages = {};
                            if (!final.languages[language])
                                final.languages[language] = 0;
                            final.languages[language]++;
                        }
                        // Count genres (~99 ms)
                        if (current.genre_ids && !notNeededTypes.has("genres")) {
                            if (!final.genres)
                                final.genres = {};
                            for (var _i = 0, _a = current.genre_ids; _i < _a.length; _i++) {
                                var genre = _a[_i];
                                if (!final.genres[genre])
                                    final.genres[genre] = 0;
                                final.genres[genre]++;
                            }
                        }
                        // Count cast (~400 ms)
                        if (current.cast && !notNeededTypes.has("cast")) {
                            if (!final.cast)
                                final.cast = {};
                            for (var _b = 0, _c = current.cast; _b < _c.length; _b++) {
                                var person = _c[_b];
                                if (!final.cast[person])
                                    final.cast[person] = 0;
                                final.cast[person]++;
                            }
                        }
                        // Count crew (~430 ms)
                        // if (!final.crew) final.crew = {}
                        // if (current.crew && !notNeededTypes.has("crew")) {
                        //   for (const person of current.crew) {
                        //     if (!final.crew[person]) final.crew[person] = 0;
                        //     final.crew[person]++;
                        //   }
                        // }
                        // Count companies (~4 ms)
                        // if (
                        //   current.production_company_ids &&
                        //   !notNeededTypes.has("production_companies")
                        // ) {
                        //   if (!final.production_companies) final.production_companies = {}
                        //   for (const company of current.production_company_ids) {
                        //     if (!final.production_companies[company])
                        //       final.production_companies[company] = 0;
                        //     final.production_companies[company]++;
                        //   }
                        // }
                        // Count keywords (~80 ms)
                        if (current.keyword_ids && !notNeededTypes.has("keywords")) {
                            if (!final.keywords)
                                final.keywords = {};
                            for (var _d = 0, _e = current.keyword_ids; _d < _e.length; _d++) {
                                var keyword = _e[_d];
                                if (!final.keywords[keyword])
                                    final.keywords[keyword] = 0;
                                final.keywords[keyword]++;
                            }
                        }
                        return final;
                    }, {});
                    // console.log(options);
                    resolve(options);
                })];
        });
    });
};
exports.optionsCounter = optionsCounter;
//# sourceMappingURL=optionsCounter.js.map