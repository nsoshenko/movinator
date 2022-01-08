import { Movie, MovieResult } from "../../domain/types/types";
import { ValuesAndWeights } from "../../utils/randomizer";

// Backend application types

// Types for Question transformations

// List of possible question types
export type QuestionType =
  | "genres"
  | "years"
  | "ratings"
  | "cast"
  | "crew"
  | "languages"
  | "production_companies"
  | "keywords";

// List of question types, which can request additional data from DB or API
export type QuestionNeedsDetails = Extract<
  "genres" | "cast" | "crew" | "production_companies" | "keywords",
  QuestionType
>;

export const doesQuestionNeedDetails = (
  type: string
): type is QuestionNeedsDetails => {
  const validLabels: QuestionNeedsDetails[] = [
    "genres",
    "cast",
    "crew",
    "production_companies",
    "keywords",
  ];
  return validLabels.includes(type as QuestionNeedsDetails);
};

// Result of questionFactory()
export type Question = {
  id: number;
  type: QuestionType;
  options: [FormattedOption, FormattedOption, FormattedOption];
};

// Chosen candidate after the options count
export type QuestionCandidate = readonly [
  QuestionType,
  number,
  [string, string]
];

// Modified candidate after getting the details from DB or API
export type QuestionCandidateWithDetails = readonly [
  QuestionType,
  number,
  [Option, Option]
];

// Predicate type used for movie filtering
export type MoviePredicate = (movie: Movie) => boolean;

// Types for Options transformations

// Result of optionsCounter()
export type Options = {
  [K in QuestionType]?: OptionsCounter;
};

// How many type each option was encountered during optionsCounter. Example { 2014: 1323 }
export type OptionsCounter = ValuesAndWeights;

// Utility type for arrays to iterate through objects of Option type
export type OptionsEntries = [QuestionType, OptionsCounter][];

// Question option
export type Option = {
  id: string | number;
  name: string;
  imageUrl?: string;
  selected?: boolean;
};

// Question option after questionFormatter()
export type FormattedOption = Option & {
  selected: boolean;
};

// Client-server communication types
export type SessionStageResponse = {
  sessionId: string;
  finished: boolean;
};

export type QuestionResponse = {
  sessionId: number;
  question: Question;
};

export type ResultResponse = {
  sessionId: number;
  result: MovieResult;
};

export const isResultResponse = (
  response: QuestionResponse | ResultResponse
): response is ResultResponse =>
  (response as ResultResponse).result !== undefined;

export type AnswerRequest = QuestionResponse;

export type OnlyIdRequest = { sessionId: number };

export const isAnswerRequest = (
  request: OnlyIdRequest | AnswerRequest
): request is AnswerRequest =>
  (request as AnswerRequest).question !== undefined;
