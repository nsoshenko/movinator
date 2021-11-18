"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerProcessor = void 0;
var filterPredicates_1 = require("./filterPredicates");
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
    var filteredArray = storage.filter((0, filterPredicates_1.excludeMovies)(property, notSelectedOptions));
    return session.setMovies(filteredArray);
};
var filterForSelectedOption = function (session, storage, property, chosenOption) {
    var filteredArray = storage.filter((0, filterPredicates_1.isProperty)(property, chosenOption.id));
    return session.setMovies(filteredArray);
};
//# sourceMappingURL=answerProcessor.js.map