"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPropertyWithImages = exports.excludeMovies = exports.isProperty = void 0;
var constants_1 = require("./types/constants");
var ARRAY_MOVIE_PROPS = ["cast", "crew", "genre_ids", "keyword_ids"];
var isArrayMovieProp = function (prop) {
    return ["cast", "crew", "genre_ids", "keyword_ids"].includes(prop);
};
// Main generic predicate to filter by property
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
// Utility to negate predicate results
var negatePredicate = function (predicate) { return function (movie) {
    return !predicate(movie);
}; };
// Negated predicate for excluding matched properties
var isNotProperty = function (prop, value) {
    return negatePredicate((0, exports.isProperty)(prop, value));
};
// Utility to combine any number of predicates
var combinePredicates = function (predicates) { return function (movie) {
    return predicates.every(function (predicate) { return predicate(movie); });
}; };
// Predicate to exclude movies for reverse filtering
var excludeMovies = function (prop, values) {
    return combinePredicates([
        isNotProperty(prop, values[0]),
        isNotProperty(prop, values[1]),
    ]);
};
exports.excludeMovies = excludeMovies;
// Predicate to check if movie has image
var hasBackdrop = function (movie) { return !!movie.backdrop_path; };
// Version of main filter predicate with images
var isPropertyWithImages = function (prop, value) { return combinePredicates([(0, exports.isProperty)(prop, value), hasBackdrop]); };
exports.isPropertyWithImages = isPropertyWithImages;
//# sourceMappingURL=filterPredicates.js.map