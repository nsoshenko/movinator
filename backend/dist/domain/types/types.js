"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGenreDetails = exports.isPersonDetails = void 0;
// Derive movie props of array type for movie filtering logic
var ARRAY_MOVIE_PROPS = ["cast", "crew", "genre_ids", "keyword_ids"];
var isPersonDetails = function (details) {
    return details.profile_path !== undefined;
};
exports.isPersonDetails = isPersonDetails;
var isGenreDetails = function (details) {
    return details.backdrop_path !== undefined;
};
exports.isGenreDetails = isGenreDetails;
//# sourceMappingURL=types.js.map