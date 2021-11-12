"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Incapsulation of TMDB API details
var axios_1 = __importDefault(require("axios"));
var instance = axios_1.default.create();
instance.defaults.baseURL = "https://api.themoviedb.org/3";
var TmdbApi = /** @class */ (function () {
    function TmdbApi() {
        this.instance = instance;
        this.key = process.env.API_KEY;
    }
    return TmdbApi;
}());
exports.default = TmdbApi;
//# sourceMappingURL=tmdbApi.js.map