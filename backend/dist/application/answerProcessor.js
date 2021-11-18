"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieExcludeFilter = exports.movieFilter = exports.answerProcessor = void 0;
var constants_1 = require("./types/constants");
var mappings_1 = require("./types/mappings");
// Function, which handles all the business logic related to answer from user
var answerProcessor = function (movieStorage, session, answer) {
    var storageToFilter = !session.isMovieStorageEmpty()
        ? session.getMovies()
        : movieStorage.getAllMovies();
    console.log("RECEIVED ANSWER");
    console.log(answer);
    var selectedOption = answer.options.find(function (_a) {
        var selected = _a.selected;
        return selected === true;
    });
    var property = mappings_1.questionTypeToMovieProperty[answer.type];
    if (selectedOption) {
        if (selectedOption.id === 0) {
            console.log("FILTERING OUT. LEFT: ");
            console.log(filterOutNotSelectedOptions(session, storageToFilter, property, answer.options));
            return answer.type;
        }
        else {
            console.log("FILTERING. LEFT: ");
            console.log(filterForSelectedOption(session, storageToFilter, property, selectedOption));
            session.banQuestionType(answer.type);
        }
    }
    else
        console.log("No selected option found");
};
exports.answerProcessor = answerProcessor;
// Answer processor helper functions (mainly filters)
var filterOutNotSelectedOptions = function (session, storage, property, options) {
    var notSelectedOptions = options.reduce(function (final, current) {
        if (current.selected === false)
            final.push(current.id);
        return final;
    }, []);
    var filteredArray = (0, exports.movieExcludeFilter)(property, notSelectedOptions, storage);
    return session.setMovies(filteredArray);
};
var filterForSelectedOption = function (session, storage, property, chosenOption) {
    var filteredArray = (0, exports.movieFilter)(property, chosenOption.id, storage);
    return session.setMovies(filteredArray);
};
// Universal utility function, which filters storage by ID of any type
var movieFilter = function (prop, value, inputArr) {
    var filteredArray = (function () {
        if (Array.isArray(inputArr[0][prop])) {
            return inputArr.filter(function (movie) {
                return Array.isArray(movie[prop]) &&
                    propertyIsNumberArray(movie[prop]).includes(Number(value));
            });
        }
        else {
            if (prop === "release_date") {
                return inputArr.filter(function (movie) { return new Date(movie[prop]).getFullYear() == value; });
            }
            else if (prop === "vote_average") {
                if (value >= 5) {
                    return inputArr.filter(function (movie) {
                        return Math.floor(movie[prop]) == value &&
                            movie.vote_count >= constants_1.MIN_VOTE_COUNT_FOR_RATING;
                    });
                }
                else {
                    return inputArr.filter(function (movie) { return Math.floor(movie[prop]) == value; });
                }
            }
            else {
                return inputArr.filter(function (movie) { return movie[prop] == value; });
            }
        }
    })();
    return filteredArray;
};
exports.movieFilter = movieFilter;
// Universal utility function, which excludes movies from storage by 2 IDs of same type
var movieExcludeFilter = function (prop, values, inputArr) {
    var filteredArray = (function () {
        if (Array.isArray(inputArr[0][prop])) {
            return inputArr.filter(function (movie) {
                return Array.isArray(movie[prop]) &&
                    propertyIsNumberArray(movie[prop]).every(function (item) { return item != values[0] && item != values[1]; });
            });
        }
        else {
            if (prop === "release_date") {
                return inputArr.filter(function (movie) {
                    var formattedValue = new Date(movie[prop]).getFullYear();
                    return formattedValue != values[0] && formattedValue != values[1];
                });
            }
            else if (prop === "vote_average") {
                return inputArr.filter(function (movie) {
                    var formattedValue = Math.floor(movie[prop]);
                    return formattedValue != values[0] && formattedValue != values[1];
                });
            }
            else {
                return inputArr.filter(function (movie) { return movie[prop] != values[0] && movie[prop] != values[1]; });
            }
        }
    })();
    return filteredArray;
};
exports.movieExcludeFilter = movieExcludeFilter;
// Brutal assertion that particular movie property is number[].
// Needed due to the fact TS can't understand it after Array.isArray(property) check.
var propertyIsNumberArray = function (property) { return property; };
//# sourceMappingURL=answerProcessor.js.map