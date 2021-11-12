"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
var Session = /** @class */ (function () {
    function Session(id) {
        var _this = this;
        // Methods for movie storage
        this.isMovieStorageEmpty = function () { return _this.getMoviesSize() === 0; };
        this.getMovies = function () { return _this.movieStorage; };
        this.getMoviesSize = function () { return _this.movieStorage.length; };
        this.setMovies = function (data) {
            _this.movieStorage = data;
            return _this.getMoviesSize();
        };
        // Methods for banned question types
        this.getBannedQuestionTypes = function (tempo) {
            if (tempo === void 0) { tempo = false; }
            return !tempo ? _this.permaBannedQuestionTypes : _this.tempoBannedQuestionTypes;
        };
        this.getAllBannedQuestionTypes = function () {
            return new Set(__spreadArray(__spreadArray([], Array.from(_this.getBannedQuestionTypes()), true), Array.from(_this.getBannedQuestionTypes(true)), true));
        };
        this.getAllBannedQuestionTypesSize = function () {
            return _this.getAllBannedQuestionTypes().size;
        };
        this.banQuestionType = function (type, tempo) {
            if (tempo === void 0) { tempo = false; }
            if (_this.isQuestionTypeBanned(type, tempo)) {
                console.log(type + " is already banned");
                return false;
            }
            !tempo
                ? _this.permaBannedQuestionTypes.add(type)
                : _this.tempoBannedQuestionTypes.add(type);
            return true;
        };
        this.isQuestionTypeBanned = function (type, tempo) {
            if (tempo === void 0) { tempo = false; }
            return !tempo
                ? _this.permaBannedQuestionTypes.has(type)
                : _this.tempoBannedQuestionTypes.has(type);
        };
        this.bannedQuestionTypesSize = function (tempo) {
            if (tempo === void 0) { tempo = false; }
            return !tempo
                ? _this.permaBannedQuestionTypes.size
                : _this.tempoBannedQuestionTypes.size;
        };
        // Special method only for tempo banned questions set
        this.resetTempoBannedQuestionTypes = function () {
            _this.tempoBannedQuestionTypes.clear();
            return _this.tempoBannedQuestionTypes.size === 0;
        };
        // Methods for banned options
        this.getBannedQuestionOptions = function () {
            return _this.permaBannedQuestionOptions;
        };
        this.getBannedQuestionOptionsByType = function (type) { return _this.permaBannedQuestionOptions[type]; };
        this.banQuestionOption = function (type, option) {
            if (_this.isQuestionOptionBanned(type, option)) {
                console.log("Option " + option + " for type " + type + " is already banned");
                return false;
            }
            else {
                if (!_this.permaBannedQuestionOptions[type])
                    _this.permaBannedQuestionOptions[type] = new Set();
                _this.permaBannedQuestionOptions[type].add(option);
                return true;
            }
        };
        this.isQuestionOptionBanned = function (type, option) {
            if (typeof _this.permaBannedQuestionOptions[type] === "undefined") {
                console.log("No option of type " + type + " is banned");
                return false;
            }
            else
                return _this.permaBannedQuestionOptions[type].has(option);
        };
        // Methods for closing the session
        this.isFinished = function () { return _this.finished; };
        this.finishSession = function (result) {
            _this.result = result;
            _this.finished = true;
            return !!_this.result;
        };
        this._id = id;
        this.finished = false;
        this._result = null;
        this.movieStorage = [];
        this.tempoBannedQuestionTypes = new Set();
        this.permaBannedQuestionTypes = new Set();
        this.permaBannedQuestionOptions = {};
    }
    Object.defineProperty(Session.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Session.prototype, "result", {
        get: function () {
            return this._result;
        },
        set: function (result) {
            this._result = result;
        },
        enumerable: false,
        configurable: true
    });
    return Session;
}());
exports.Session = Session;
var SessionStorage = /** @class */ (function () {
    function SessionStorage() {
        var _this = this;
        this.generateSessionId = function () {
            return _this.sessionStorage.length === 0
                ? 1
                : Math.max.apply(Math, Array.from(_this.sessionStorageIndexes.keys())) + 1;
        };
        this.createNewSession = function () {
            var session = new Session(_this.generateSessionId());
            _this.sessionStorage.push(session);
            _this.sessionStorageIndexes.set(session.id, _this.sessionStorage.length - 1);
            return session.id;
        };
        this.getSessionById = function (id) {
            var index = _this.sessionStorageIndexes.get(id);
            return typeof index !== "undefined"
                ? _this.sessionStorage[index]
                : undefined;
        };
        this.sessionStorage = [];
        this.sessionStorageIndexes = new Map();
    }
    return SessionStorage;
}());
exports.default = SessionStorage;
//# sourceMappingURL=SessionStorage.js.map