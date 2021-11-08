import MovieStorage from "../storage/Storage";

// Initialize in-mem storage from JSON files on HDD
const movieStorage: MovieStorage = new MovieStorage(
  "./json_db/dev_movies.json",
  {
    genres: "./json_db/genres.json",
    people: "./json_db/people.json",
    production_companies: "./json_db/production_companies.json",
    keywords: "./json_db/keywords.json",
  }
);

console.log(movieStorage.getAllMovies()[0]);
console.log(movieStorage.getStorageLabels());
