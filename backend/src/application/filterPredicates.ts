import { Movie, MovieDetails, MovieProperty } from "../domain/types/types";
import { MIN_VOTE_COUNT_FOR_RATING } from "./types/constants";

type MoviePredicate = (movie: Movie) => boolean;

const ARRAY_MOVIE_PROPS = ["cast", "crew", "genre_ids", "keyword_ids"] as const;
type ArrayMovieProps = typeof ARRAY_MOVIE_PROPS;
type ArrayMovieProp = ArrayMovieProps[number];

const isArrayMovieProp = (prop: MovieProperty): prop is ArrayMovieProp =>
  (["cast", "crew", "genre_ids", "keyword_ids"] as ArrayMovieProps).includes(
    prop as ArrayMovieProp
  );

// Needed complicated predicate
export const isProperty = (prop: MovieProperty, value: number | string) => {
  console.log(`Checking property: ${value}`);
  if (isArrayMovieProp(prop)) {
    return (movie: Movie) =>
      movie[prop] ? movie[prop]!.includes(Number(value)) : false;
  }
  if (prop === "release_date") {
    return (movie: Movie) =>
      movie[prop]
        ? new Date(movie[prop]!).getFullYear() === Number(value)
        : false;
  }
  if (prop === "vote_average") {
    return (movie: Movie) => {
      if (movie[prop]) {
        return Number(value) >= 5
          ? Math.floor(movie[prop]!) === Number(value) &&
              movie.vote_count! >= MIN_VOTE_COUNT_FOR_RATING
          : Math.floor(movie[prop]!) === Number(value);
      } else return false;
    };
  }
  return (movie: Movie) => (movie[prop] ? movie[prop] == value : false);
};

const negatePredicate = (predicate: MoviePredicate) => (movie: Movie) =>
  !predicate(movie);

const isNotProperty = (prop: MovieProperty, value: number | string) =>
  negatePredicate(isProperty(prop, value));

const combinePredicates = (predicates: MoviePredicate[]) => (movie: Movie) =>
  predicates.every((predicate) => predicate(movie));

export const excludeMovies = (
  prop: MovieProperty,
  values: [string | number, string | number]
) =>
  combinePredicates([
    isNotProperty(prop, values[0]),
    isNotProperty(prop, values[1]),
  ]);

const hasBackdrop = (movie: Movie) => !!movie.backdrop_path;

export const isPropertyWithImages = (
  prop: MovieProperty,
  value: string | number
) => combinePredicates([isProperty(prop, value), hasBackdrop]);
