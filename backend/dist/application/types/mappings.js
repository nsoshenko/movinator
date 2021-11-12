"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionTypeToMovieProperty = exports.questionTypeToEndpoint = void 0;
exports.questionTypeToEndpoint = {
    genres: "/genre/movie/list",
    cast: "/person",
    crew: "/person",
    production_companies: "/company",
    keywords: "/keyword",
};
exports.questionTypeToMovieProperty = {
    genres: "genre_ids",
    cast: "cast",
    crew: "crew",
    years: "release_date",
    production_companies: "production_company_ids",
    keywords: "keyword_ids",
    ratings: "vote_average",
    languages: "original_language",
};
//# sourceMappingURL=mappings.js.map