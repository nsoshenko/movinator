// Domain types
export type Language = "en" | "ru" | "ar" | "ja";

export type ReleaseStatus = "Released";

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
  status: ReleaseStatus;
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

export type Movie = Pick<
  MovieDetails,
  | "id"
  | "budget"
  | "original_language"
  | "title"
  | "popularity"
  | "release_date"
  | "revenue"
  | "runtime"
  | "vote_average"
  | "vote_count"
  | "genre_ids"
  | "production_company_ids"
  | "cast"
  | "crew"
  | "keyword_ids"
>;

export type MovieProperty = keyof Movie;

export type PersonDetails = BasicDetails & {
  adult: boolean;
  also_known_as?: string[];
  biography?: string;
  birthday: string | null;
  deathday: string | null;
  gender: 0 | 1 | 2;
  homepage: string | null;
  imdb_id: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
};

export type BasicDetails = {
  id: number;
  name: string;
};

export type GenreDetails = BasicDetails;

export type ProdCompanyDetails = BasicDetails & {
  description: string;
  headquarters: string;
  homepage: string;
  logo_path: string | null;
  origin_country: string | null;
  parent_company: string | null;
};

export type KeywordDetails = BasicDetails;

export type Details =
  | GenreDetails
  | PersonDetails
  | KeywordDetails
  | ProdCompanyDetails;
