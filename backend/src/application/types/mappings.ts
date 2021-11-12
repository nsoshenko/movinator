import { MovieProperty } from "../../domain/types/types";
import { QuestionType, QuestionNeedsDetails } from "./types";

type QuestionTypeToEndpoint = {
  [K in QuestionType & QuestionNeedsDetails]: TmdbEndpoint;
};

type QuestionTypeToMovieProperty = {
  [K in QuestionType]: MovieProperty;
};

export type TmdbEndpoint =
  | "/genre/movie/list"
  | "/person"
  | "/company"
  | "/keyword";

export const questionTypeToEndpoint: QuestionTypeToEndpoint = {
  genres: "/genre/movie/list",
  cast: "/person",
  crew: "/person",
  production_companies: "/company",
  keywords: "/keyword",
};

export const questionTypeToMovieProperty: QuestionTypeToMovieProperty = {
  genres: "genre_ids",
  cast: "cast",
  crew: "crew",
  years: "release_date",
  production_companies: "production_company_ids",
  keywords: "keyword_ids",
  ratings: "vote_average",
  languages: "original_language",
};
