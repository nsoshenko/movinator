// Class with implementation of in-mem storage for all temporary session data
import { Movie } from "../domain/types/types";
import { MoviePredicate, QuestionType } from "../application/types/types";
import { BannedQuestionOptions } from "./types";

export class Session {
  private _id: number;
  private finished: boolean;
  private _result: number | null;

  private movieStorage: Movie[];
  private tempoBannedQuestionTypes: Set<QuestionType>;
  private permaBannedQuestionTypes: Set<QuestionType>;
  private permaBannedQuestionOptions: BannedQuestionOptions;
  // private state: MoviePredicate[];
  private similarResults: number[];
  private previousResults: number[];

  constructor(id: number) {
    this._id = id;
    this.finished = false;
    this._result = null;

    this.movieStorage = [];
    this.tempoBannedQuestionTypes = new Set();
    this.permaBannedQuestionTypes = new Set();
    this.permaBannedQuestionOptions = {};
    // this.state = [];
    this.similarResults = [];
    this.previousResults = [];
  }

  // Methods for movie storage
  isMovieStorageEmpty = (): boolean => this.getMoviesSize() === 0;

  getMovies = (): Movie[] => this.movieStorage;

  getMoviesSize = (): number => this.movieStorage.length;

  setMovies = (data: Movie[]): number => {
    this.movieStorage = data;
    return this.getMoviesSize();
  };

  // Methods for banned question types
  getBannedQuestionTypes = (tempo: boolean = false): Set<QuestionType> =>
    !tempo ? this.permaBannedQuestionTypes : this.tempoBannedQuestionTypes;

  getAllBannedQuestionTypes = (): Set<QuestionType> =>
    new Set([
      ...Array.from(this.getBannedQuestionTypes()),
      ...Array.from(this.getBannedQuestionTypes(true)),
    ]);

  getAllBannedQuestionTypesSize = (): number =>
    this.getAllBannedQuestionTypes().size;

  banQuestionType = (type: QuestionType, tempo: boolean = false): boolean => {
    if (this.isQuestionTypeBanned(type, tempo)) {
      console.log(`${type} is already banned`);
      return false;
    }
    !tempo
      ? this.permaBannedQuestionTypes.add(type)
      : this.tempoBannedQuestionTypes.add(type);
    return true;
  };

  isQuestionTypeBanned = (
    type: QuestionType,
    tempo: boolean = false
  ): boolean =>
    !tempo
      ? this.permaBannedQuestionTypes.has(type)
      : this.tempoBannedQuestionTypes.has(type);

  bannedQuestionTypesSize = (tempo: boolean = false): number =>
    !tempo
      ? this.permaBannedQuestionTypes.size
      : this.tempoBannedQuestionTypes.size;

  // Special method only for tempo banned questions set
  resetTempoBannedQuestionTypes = (): boolean => {
    this.tempoBannedQuestionTypes.clear();
    return this.tempoBannedQuestionTypes.size === 0;
  };

  // Methods for banned options
  getBannedQuestionOptions = (): BannedQuestionOptions =>
    this.permaBannedQuestionOptions;

  getBannedQuestionOptionsByType = (
    type: QuestionType
  ): Set<string | number> | undefined => this.permaBannedQuestionOptions[type];

  banQuestionOption = (type: QuestionType, option: string): boolean => {
    if (this.isQuestionOptionBanned(type, option)) {
      console.log(`Option ${option} for type ${type} is already banned`);
      return false;
    } else {
      if (!this.permaBannedQuestionOptions[type])
        this.permaBannedQuestionOptions[type] = new Set();
      this.permaBannedQuestionOptions[type]!.add(option);
      return true;
    }
  };

  isQuestionOptionBanned = (
    type: QuestionType,
    option: string | number
  ): boolean => {
    if (typeof this.permaBannedQuestionOptions[type] === "undefined") {
      console.log(`No option of type ${type} is banned`);
      return false;
    } else return this.permaBannedQuestionOptions[type]!.has(option);
  };

  // // Methods for working with state
  // getState = (step?: number) => this.state.slice(0, step);

  // appendToState = (predicate: MoviePredicate) => this.state.push(predicate);

  // revertState = (numberOfSteps: number) =>
  //   (this.state = this.state.slice(0, -numberOfSteps));

  // Methods for closing the session
  isFinished = () => this.finished;

  finishSession = (result: number): boolean => {
    this.result = result;
    this.previousResults.push(result);
    this.finished = true;
    return !!this.result;
  };

  get id(): number {
    return this._id;
  }

  get result(): number | null {
    return this._result;
  }
  private set result(result: number | null) {
    this._result = result;
  }

  // Methods for similar results
  setSimilarResults = (similarMovies: number[]): number[] =>
    (this.similarResults = [...similarMovies]);

  hasSimilarResults = (): boolean => this.similarResults.length > 0;

  getSimilarResults = (): number[] => this.similarResults;

  // Methods for results history
  isInPreviousResults = (result: number) =>
    this.previousResults.includes(result);

  isNotInPreviousResults = (result: number) =>
    !this.isInPreviousResults(result);

  getPreviousResults = (): number[] => this.previousResults;
}

export default class SessionStorage {
  private sessionStorage: Session[];
  private sessionStorageIndexes: Map<number, number>;

  constructor() {
    this.sessionStorage = [];
    this.sessionStorageIndexes = new Map();
  }

  private generateSessionId = (): number => {
    return this.sessionStorage.length === 0
      ? 1
      : Math.max(...Array.from(this.sessionStorageIndexes.keys())) + 1;
  };

  createNewSession = (): number => {
    const session = new Session(this.generateSessionId());
    this.sessionStorage.push(session);
    this.sessionStorageIndexes.set(session.id, this.sessionStorage.length - 1);
    return session.id;
  };

  getSessionById = (id: number): Session | undefined => {
    const index = this.sessionStorageIndexes.get(id);
    return typeof index !== "undefined"
      ? this.sessionStorage[index]
      : undefined;
  };
}
