import { Movie, MovieProperty } from "../domain/types/types";
import { Session } from "../storage/SessionStorage";
import MovieStorage from "../storage/Storage";
import { excludeMovies, isProperty } from "./filterPredicates";
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
  ) as [string | number, string | number];
  const filteredArray = storage.filter(
    excludeMovies(property, notSelectedOptions)
  );
  return session.setMovies(filteredArray);
};

const filterForSelectedOption = (
  session: Session,
  storage: readonly Movie[],
  property: MovieProperty,
  chosenOption: FormattedOption
): number => {
  const filteredArray = storage.filter(isProperty(property, chosenOption.id));
  return session.setMovies(filteredArray);
};
