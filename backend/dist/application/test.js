"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./types/constants");
var movies = [
    {
        id: 1,
        original_language: "en",
        cast: [1, 2],
    },
    {
        id: 2,
        original_language: "es",
        cast: [2, 9],
    },
    {
        id: 3,
        original_language: "ru",
        cast: [1],
    },
];
var isArrayMovieProp = function (prop) {
    return ["cast", "crew", "genre_ids"].includes(prop);
};
// Basic predicate for understanding
var isEnglish = function (movie) {
    return movie.original_language === "en";
};
var negatePredicate = function (predicate) { return function (movie) {
    return !predicate(movie);
}; };
var isNotEnglish = negatePredicate(isEnglish);
// Predicate with property for understanding
var isLanguage = function (language) { return function (movie) {
    return movie.original_language === language;
}; };
var isNotLanguage = function (language) {
    return negatePredicate(isLanguage(language));
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
    return function (movie) {
        return movie[prop] ? movie[prop] == value : false;
    };
};
var isNotProperty = function (prop, value) {
    return negatePredicate(isProperty(prop, value));
};
var combinePredicates = function (predicate1, predicate2) {
    return function (movie) {
        return predicate1(movie) && predicate2(movie);
    };
};
var combinePredicates2 = function (predicates) { return function (movie) {
    return predicates.every(function (predicate) { return predicate(movie); });
}; };
var excludeMovies = function (prop, values) {
    return combinePredicates2([
        isNotProperty(prop, values[0]),
        isNotProperty(prop, values[1]),
    ]);
};
var hasBackdrop = function (movie) { return !!movie.backdrop_path; };
// console.log(movies.filter(isProperty("cast", "1")));
console.log(movies.filter(excludeMovies("cast", ["3", "9"])));
//# sourceMappingURL=test.js.map