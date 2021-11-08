import { optionsCounter } from "./optionsCounter";
import { READY_TO_FINISH_THRESHOLD } from "./types/constants";
import MovieStorage from "../storage/Storage";
import SessionStorage, { Session } from "../storage/SessionStorage";
import {
  Options,
  QuestionResponse,
  OnlyIdRequest,
  AnswerRequest,
  ResultResponse,
  isAnswerRequest,
} from "./types/types";
import { Movie } from "../../domain/types/types";
import { weightedRandomizer } from "../utils/utils";
import { questionFactory } from "./questionFactory";
import { answerProcessor } from "./answerProcessor";

// Initialize in-mem storage from JSON files on HDD
const movieStorage: MovieStorage = new MovieStorage(
  process.env.MOVIE_DB_PATH as string,
  {
    genres: process.env.GENRES_DB_PATH,
    people: process.env.PEOPLE_DB_PATH,
    production_companies: process.env.PRODUCTION_COMPANIES_DB_PATH,
    keywords: process.env.KEYWORDS_DB_PATH,
  }
);

const allSessionsStorage: SessionStorage = new SessionStorage();

var defaultOptions: Options = {}; // Needed not to do a full optionsCounter on each session start

// Question endpoint handlers
export const questionGetHandler = async (): Promise<
  QuestionResponse | Error
> => {
  const sessionId = allSessionsStorage.createNewSession();
  const session = allSessionsStorage.getSessionById(sessionId);
  const question = await questionFactory(
    defaultOptions,
    movieStorage,
    session!
  );
  if (question) {
    console.log(question);
    return { sessionId: sessionId, question: question };
  } else return new Error("No question was returned from GET request");
};

export const questionPostHandler = async (
  requestData: OnlyIdRequest | AnswerRequest
): Promise<QuestionResponse | ResultResponse | Error> => {
  const session = allSessionsStorage.getSessionById(
    Number(requestData.sessionId)
  );
  if (!session) {
    throw new Error(`Unknown session ID ${requestData.sessionId} in request`);
  }

  // Check if session already has stored result
  const sessionResult = session.result;
  if (sessionResult) {
    const sessionResultDetails =
      movieStorage.getFullMovieDetailsById(sessionResult);
    if (sessionResultDetails)
      return { sessionId: session.id, result: sessionResultDetails };
    else return new Error(`No movie with ID ${sessionResult} was found in DB`);
  }

  if (isAnswerRequest(requestData)) {
    const possibleForcedQuestionType = answerProcessor(
      movieStorage,
      session,
      requestData.question
    );
    if (readyToFinish(session, READY_TO_FINISH_THRESHOLD)) {
      const resultMovie = pickResult(session.getMovies());
      if (resultMovie) {
        const resultMovieDetails = movieStorage.getFullMovieDetailsById(
          resultMovie.id
        );
        if (resultMovieDetails) {
          session.finishSession(resultMovieDetails.id);
          return { sessionId: session.id, result: resultMovieDetails };
        } else console.log(`No movie with ${resultMovie.id} was found`);
      } else console.log("No result was picked");
    }
  }

  const question = await questionFactory(defaultOptions, movieStorage, session);
  if (question) return { sessionId: session.id, question: question };
  else return new Error("No question was returned from POST request");
};

const readyToFinish = (session: Session, finishThreshold: number): boolean =>
  session.getMoviesSize() <= finishThreshold;

const pickResult = (arr: Movie[]): Movie | undefined => {
  const moviesToRandomize = arr.reduce(
    (final: { [index: number]: number }, current, index) => {
      final[index] = Math.floor(
        (current.popularity + 1) * (current.vote_count + 1)
      );
      return final;
    },
    {}
  );

  const randomMovieIndex = Number(weightedRandomizer(moviesToRandomize));
  return arr[randomMovieIndex];
};

// Initialize default counter once the service is up not to do it for every session
export const initializeDefaultCounters = async () => {
  const options = await optionsCounter(movieStorage.getAllMovies());
  defaultOptions = options;
};
