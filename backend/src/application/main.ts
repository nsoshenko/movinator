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
  SessionStageResponse,
} from "./types/types";
import { Movie, MovieResult } from "../domain/types/types";
import { weightedRandomizer } from "../utils/randomizer";
import { questionFactory } from "./questionFactory";
import { answerProcessor } from "./answerProcessor";
import TmdbApi from "./tmdbApi";

// Check session endpoint handler
export const sessionCheckHandler = async (
  sessionData: OnlyIdRequest,
  allSessionsStorage: SessionStorage
): Promise<SessionStageResponse> => {
  const sessionId = Number(sessionData.sessionId);
  const session = allSessionsStorage.getSessionById(sessionId);
  if (!session) throw new Error(`No session with ID ${sessionId} was found`);
  else return { sessionId: "" + sessionId, finished: session.isFinished() };
};

// Question endpoint handlers
export const questionGetHandler = async (
  allSessionsStorage: SessionStorage,
  defaultOptions: Options,
  movieStorage: MovieStorage
): Promise<QuestionResponse | Error> => {
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
  requestData: OnlyIdRequest | AnswerRequest,
  allSessionsStorage: SessionStorage,
  defaultOptions: Options,
  movieStorage: MovieStorage
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
    const sessionResultDetails = prepareMovieResult(
      sessionResult,
      movieStorage
    );
    if (sessionResultDetails) {
      return { sessionId: session.id, result: sessionResultDetails };
    } else
      return new Error(`No movie with ID ${sessionResult} was found in DB`);
  }

  if (isAnswerRequest(requestData)) {
    console.log(requestData);
    const possibleForcedQuestionType = answerProcessor(
      movieStorage,
      session,
      requestData.question
    );
    if (readyToFinish(session, READY_TO_FINISH_THRESHOLD)) {
      const resultMovie = pickResult(session.getMovies());
      if (resultMovie) {
        const resultMovieDetails = prepareMovieResult(
          resultMovie.id,
          movieStorage
        );
        if (resultMovieDetails) {
          session.finishSession(resultMovieDetails.id);
          return { sessionId: session.id, result: resultMovieDetails };
        }
      } else console.log("No result was picked");
    }
  }

  const question = await questionFactory(defaultOptions, movieStorage, session);
  if (question) return { sessionId: session.id, question: question };
  else return new Error("No question was returned from POST request");
};

export const similarMovieHandler = async (
  requestData: OnlyIdRequest,
  allSessionsStorage: SessionStorage,
  movieStorage: MovieStorage
): Promise<ResultResponse | Error> => {
  const session = allSessionsStorage.getSessionById(requestData.sessionId);
  if (!session) throw new Error("No session found");
  if (!session.isFinished()) throw new Error("Session is not finished");
  if (!session.result)
    throw new Error("Session is finished, but no result found");
  const sessionResultId = session.result;
  const recommendations = session.hasSimilarResults()
    ? session.getSimilarResults()
    : session.setSimilarResults(
        await getRecommendationsFromApi(sessionResultId)
      );
  const filteredRecommendations = recommendations.filter(
    session.isNotInPreviousResults
  );
  console.log("NUMBER OF RECOMMENDATIONS: " + filteredRecommendations.length);
  console.log(filteredRecommendations.slice(0, 10));
  for (let i = 0; i < filteredRecommendations.length; i++) {
    const randomRecommendationId =
      filteredRecommendations[
        Math.floor(Math.random() * filteredRecommendations.length)
      ];
    try {
      const movieResult = prepareMovieResult(
        randomRecommendationId,
        movieStorage
      );
      if (movieResult) {
        session.finishSession(randomRecommendationId);
        return { sessionId: session.id, result: movieResult };
      }
    } catch (error) {
      console.log(error);
      continue;
    }
  }
  throw new Error("No recommendations found");
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

const prepareMovieResult = (
  id: number,
  movieStorage: MovieStorage
): MovieResult => {
  const resultMovieDetails = movieStorage.getFullMovieDetailsById(id);
  if (resultMovieDetails) {
    const resultMovieCast = resultMovieDetails.cast
      .slice(0, 20)
      .reduce((final: string[], current) => {
        const castDetails = movieStorage.getDetailsById("people", current);
        if (castDetails) final.push(castDetails.name);
        return final;
      }, [])
      .slice(0, 10);
    const resultMovieDetailsWithCast = {
      ...resultMovieDetails,
      cast: resultMovieCast,
    };
    return resultMovieDetailsWithCast;
  } else throw Error(`No movie with ${id} was found`);
};

const getRecommendationsFromApi = async (id: number): Promise<number[]> => {
  const api = new TmdbApi();

  const response = await api.instance.get(
    `/movie/${id}/recommendations?api_key=${api.key}`
  );
  const recommendations = response.data.results as Movie[];
  return recommendations.map((movie) => movie.id);
};
