import { MovieProperty } from "../../domain/types/types";
import { QuestionType, QuestionNeedsDetails } from "./types";

type QuestionTypeToEndpoint = {
  [K in QuestionType & QuestionNeedsDetails]: TmdbEndpoint;
};

type QuestionTypeToMovieProperty = {
  [K in QuestionType]: MovieProperty;
};

type Mapping = {
  [K in string]: string;
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

export const ratingToPhrase: Mapping = {
  "1": "Worst of your life",
  "2": "For bad-movie lovers",
  "3": "For daring allseeners",
  "4": "Low rating",
  "5": "Just an average one",
  "6": "Good enough",
  "7": "Marginally better than good",
  "8": "Must see",
  "9": "Masterpiece",
};
