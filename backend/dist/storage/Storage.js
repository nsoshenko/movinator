"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Class with implemenation of in-memory storage and its operations
var fs_1 = __importDefault(require("fs"));
var types_1 = require("./types");
var MovieStorage = /** @class */ (function () {
    function MovieStorage(movieDbPath, helperDbPaths) {
        var _this = this;
        // Methods for manipulations with persistentMovieStorage
        this.getFullMovieDetailsById = function (id) {
            var index = _this.persistentMovieStorageIndexes.get(id);
            return typeof index !== "undefined"
                ? _this.persistentMovieStorage[index]
                : undefined;
        };
        this.getFullMovieDetailsByTitle = function (title) {
            var movie = _this.operationalMovieStorage.find(function (movie) { return movie.title === title; });
            return typeof movie !== "undefined"
                ? _this.getFullMovieDetailsById(movie.id)
                : undefined;
        };
        this.appendToPersistentMovieStorage = function (data) {
            var initialLength = _this.persistentMovieStorage.length;
            if (Array.isArray(data)) {
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var movie = data_1[_i];
                    _this.addMovieToPersistentStorage(movie);
                }
            }
            else
                _this.addMovieToPersistentStorage(data);
            return _this.persistentMovieStorage.length > initialLength;
        };
        this.addMovieToPersistentStorage = function (movie) {
            if (!_this.persistentMovieStorageIndexes.get(movie.id)) {
                _this.persistentMovieStorage.push(movie);
                _this.persistentMovieStorageIndexes.set(movie.id, _this.persistentMovieStorage.length - 1);
                return true;
            }
            else {
                console.log("The movie is already in storage");
                return false;
            }
        };
        this.writePersistentStorageToDB = function () {
            var dataToWrite = JSON.stringify({ movies: _this.persistentMovieStorage });
            fs_1.default.writeFile("../json_db/" + Date.now() + "_movies.json", dataToWrite, function () {
                throw new Error("DB is not updated");
            });
            console.log("DB is updated");
        };
        // Get full operationalStorage
        this.getAllMovies = function () { return _this.operationalMovieStorage; };
        // Methods for manipulations with HelpInfoStorage
        this.getDetailsById = function (storageLabel, id) {
            var neededStorage = _this.helpInfoStorage[storageLabel];
            if (neededStorage) {
                return neededStorage.find(function (item) { return item.id == id; });
            }
            else
                console.log("There is no storage with such label: " + storageLabel);
        };
        this.getStorageLabels = function () {
            return Object.keys(_this.helpInfoStorage).filter(types_1.isHelperStorageLabel);
        };
        this.appendToHelpInfoStorage = function (storageLabel, data) {
            var neededStorage = _this.helpInfoStorage[storageLabel];
            if (neededStorage) {
                var initialLength = neededStorage.length;
                if (Array.isArray(data)) {
                    neededStorage.push.apply(neededStorage, data);
                }
                else
                    neededStorage.push(data);
                return neededStorage.length > initialLength;
            }
            else {
                console.log("There is no such storage");
                return false;
            }
        };
        this.writeHelpInfoStorageToDB = function (storageLabel) {
            var _a;
            var dataToWrite = JSON.stringify((_a = {},
                _a[storageLabel] = _this.helpInfoStorage[storageLabel],
                _a));
            fs_1.default.writeFile("../json_db/" + Date.now() + "_" + storageLabel + ".json", dataToWrite, function () {
                throw new Error("DB is not updated");
            });
            console.log(storageLabel + " DB is updated");
        };
        // Initialize persitentMovieStorage from JSON DB
        var readData = JSON.parse(fs_1.default.readFileSync(movieDbPath)); // ???
        this.persistentMovieStorage = readData.movies;
        // Initialize persistentMovieStorageIndexes
        this.persistentMovieStorageIndexes = new Map();
        for (var i = 0; i < this.persistentMovieStorage.length; i++) {
            var movieId = this.persistentMovieStorage[i].id;
            this.persistentMovieStorageIndexes.set(movieId, i);
        }
        // Initialize operationalMovieStorage taking only needed data from persistentMovieStorage
        this.operationalMovieStorage = this.persistentMovieStorage.reduce(function (final, movie) {
            if (!movie.adult && movie.cast && movie.crew && movie.runtime >= 60)
                final.push({
                    id: movie.id,
                    budget: movie.budget,
                    original_language: movie.original_language,
                    title: movie.title,
                    popularity: movie.popularity,
                    release_date: movie.release_date,
                    revenue: movie.revenue,
                    runtime: movie.runtime,
                    vote_average: movie.vote_average,
                    vote_count: movie.vote_count,
                    genre_ids: movie.genre_ids,
                    production_company_ids: movie.production_company_ids,
                    cast: movie.cast,
                    crew: movie.crew,
                    keyword_ids: movie.keyword_ids,
                    backdrop_path: movie.backdrop_path,
                    director: movie.director,
                });
            return final;
        }, []);
        // Initialize helpInfoStorage iterating through paths and reading additional JSON DB files
        this.helpInfoStorage = {};
        if (helperDbPaths) {
            Object.entries(helperDbPaths).forEach(function (_a) {
                var label = _a[0], path = _a[1];
                var readData = JSON.parse(fs_1.default.readFileSync(path));
                if ((0, types_1.isHelperStorageLabel)(label)) {
                    _this.helpInfoStorage[label] = readData[label];
                    console.log("Helper storage with for " + label + " initialized");
                }
            });
        }
    }
    return MovieStorage;
}());
exports.default = MovieStorage;
//# sourceMappingURL=Storage.js.map