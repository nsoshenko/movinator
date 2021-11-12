import { Movie, MovieProperty } from "../domain/types/types";
import { Session } from "../storage/SessionStorage";
import MovieStorage from "../storage/Storage";
import { MIN_VOTE_COUNT_FOR_RATING } from "./types/constants";
import { questionTypeToMovieProperty } from "./types/mappings";
import { Question, QuestionType, FormattedOption } from "./types/types";

// Function, which handles all the business logic related to answer from user
export const answerProcessor = (
  movieStorage: MovieStorage,
  session: Session,
  answer: Question
): QuestionType | void => {
  const storageToFilter = !session.isMovieStorageEmpty()
    ? session.getMovies()
    : movieStorage.getAllMovies();
  console.log("RECEIVED ANSWER");
  console.log(answer);
  const selectedOption = answer.options.find(
    ({ selected }) => selected === true
  );
  const property = questionTypeToMovieProperty[answer.type];
  if (selectedOption) {
    if (selectedOption.id === 0) {
      console.log("FILTERING OUT. LEFT: ");
      console.log(
        filterOutNotSelectedOptions(
          session,
          storageToFilter,
          property,
          answer.options
        )
      );
      return answer.type;
    } else {
      console.log("FILTERING. LEFT: ");
      console.log(
        filterForSelectedOption(
          session,
          storageToFilter,
          property,
          selectedOption
        )
      );
      session.banQuestionType(answer.type);
    }
  } else console.log("No selected option found");
};

// Answer processor helper functions (mainly filters)
const filterOutNotSelectedOptions = (
  session: Session,
  storage: readonly Movie[],
  property: MovieProperty,
  options: FormattedOption[]
): number => {
  const notSelectedOptions = options.reduce(
    (final: (string | number)[], current: FormattedOption) => {
      if (current.selected === false) final.push(current.id);
      return final;
    },
    []
  );
  const filteredArray = movieExcludeFilter(
    property,
    notSelectedOptions,
    storage
  );
  return session.setMovies(filteredArray);
};

const filterForSelectedOption = (
  session: Session,
  storage: readonly Movie[],
  property: MovieProperty,
  chosenOption: FormattedOption
): number => {
  const filteredArray = movieFilter(property, chosenOption.id, storage);
  return session.setMovies(filteredArray);
};

// Universal utility function, which filters storage by ID of any type
export const movieFilter = (
  prop: MovieProperty,
  value: string | number,
  inputArr: readonly Movie[]
): Movie[] => {
  const filteredArray = (() => {
    if (Array.isArray(inputArr[0][prop])) {
      return inputArr.filter(
        (movie) =>
          Array.isArray(movie[prop]) &&
          propertyIsNumberArray(movie[prop]).includes(Number(value))
      );
    } else {
      if (prop === "release_date") {
        return inputArr.filter(
          (movie) => new Date(movie[prop]).getFullYear() == value
        );
      } else if (prop === "vote_average") {
        if (value >= 5) {
          return inputArr.filter(
            (movie) =>
              Math.floor(movie[prop]) == value &&
              movie.vote_count >= MIN_VOTE_COUNT_FOR_RATING
          );
        } else {
          return inputArr.filter((movie) => Math.floor(movie[prop]) == value);
        }
      } else {
        return inputArr.filter((movie) => movie[prop] == value);
      }
    }
  })();
  return filteredArray;
};

// Universal utility function, which excludes movies from storage by 2 IDs of same type
export const movieExcludeFilter = (
  prop: MovieProperty,
  values: (string | number)[],
  inputArr: readonly Movie[]
): Movie[] => {
  const filteredArray = (() => {
    if (Array.isArray(inputArr[0][prop])) {
      return inputArr.filter(
        (movie) =>
          Array.isArray(movie[prop]) &&
          propertyIsNumberArray(movie[prop]).every(
            (item) => item != values[0] && item != values[1]
          )
      );
    } else {
      if (prop === "release_date") {
        return inputArr.filter((movie) => {
          const formattedValue = new Date(movie[prop]).getFullYear();
          return formattedValue != values[0] && formattedValue != values[1];
        });
      } else if (prop === "vote_average") {
        return inputArr.filter((movie) => {
          const formattedValue = Math.floor(movie[prop]);
          return formattedValue != values[0] && formattedValue != values[1];
        });
      } else {
        return inputArr.filter(
          (movie) => movie[prop] != values[0] && movie[prop] != values[1]
        );
      }
    }
  })();
  return filteredArray;
};

// Brutal assertion that particular movie property is number[].
// Needed due to the fact TS can't understand it after Array.isArray(property) check.
const propertyIsNumberArray = (
  property: number | string | number[]
): number[] => property as number[];
