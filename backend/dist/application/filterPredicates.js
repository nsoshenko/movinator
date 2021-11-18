"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPropertyWithImages = exports.excludeMovies = exports.isProperty = void 0;
var constants_1 = require("./types/constants");
var isArrayMovieProp = function (prop) {
    return ["cast", "crew", "genre_ids", "keywords_ids"].includes(prop);
};
// Needed complicated predicate
var isProperty = function (prop, value) {
    console.log("Checking property: " + value);
    if (isArrayMovieProp(prop)) {
        return function (movie) {
            return movie[prop] ? movie[prop].includes(Number(value)) : false;
        };
    }
    if (prop === "release_date") {
        return function (movie) {
            return movie[prop]
                ? new Date(movie[prop]).getFullYear() === Number(value)
                : false;
        };
    }
    if (prop === "vote_average") {
        return function (movie) {
            if (movie[prop]) {
                return Number(value) >= 5
                    ? Math.floor(movie[prop]) === Number(value) &&
                        movie.vote_count >= constants_1.MIN_VOTE_COUNT_FOR_RATING
                    : Math.floor(movie[prop]) === Number(value);
            }
            else
                return false;
        };
    }
    return function (movie) { return (movie[prop] ? movie[prop] == value : false); };
};
exports.isProperty = isProperty;
var negatePredicate = function (predicate) { return function (movie) {
    return !predicate(movie);
}; };
var isNotProperty = function (prop, value) {
    return negatePredicate((0, exports.isProperty)(prop, value));
};
var combinePredicates = function (predicates) { return function (movie) {
    return predicates.every(function (predicate) { return predicate(movie); });
}; };
var excludeMovies = function (prop, values) {
    return combinePredicates([
        isNotProperty(prop, values[0]),
        isNotProperty(prop, values[1]),
    ]);
};
exports.excludeMovies = excludeMovies;
var hasBackdrop = function (movie) { return !!movie.backdrop_path; };
var isPropertyWithImages = function (prop, value) { return combinePredicates([(0, exports.isProperty)(prop, value), hasBackdrop]); };
exports.isPropertyWithImages = isPropertyWithImages;
//# sourceMappingURL=filterPredicates.js.map