type ApiResponse = {
  sessionId: string;
};

export type SessionStageResponse = ApiResponse & {
  finished: boolean;
};

export type QuestionResponse = ApiResponse & {
  question: Question;
};

export type ResultResponse = ApiResponse & {
  result: MovieDetails;
};

export const isResultResponse = (
  response: QuestionResponse | ResultResponse
): response is ResultResponse =>
  (response as ResultResponse).result !== undefined;

export type MovieDetails = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: number[];
  budget: number;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_countries: string[];
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  production_company_ids: number[];
  cast: number[];
  crew: number[];
  keyword_ids: number[];
};

type Question = {
  id: number;
  type: QuestionType;
  options: [FormattedOption, FormattedOption, FormattedOption];
};

type QuestionType =
  | "genres"
  | "years"
  | "ratings"
  | "cast"
  | "crew"
  | "languages"
  | "production_companies"
  | "keywords";

type FormattedOption = Option & {
  selected: boolean;
};

type Option = {
  id: string | number;
  name: string;
  imageUrl?: string;
  selected?: boolean;
};
