// Class with implemenation of in-memory storage and its operations
import fs from "fs";
import { MovieDetails, Movie, Details } from "../domain/types/types";
import {
  HelpInfoStorage,
  HelperStoragePaths,
  isHelperStorageLabel,
  HelperStorageLabel,
} from "./types";

export default class MovieStorage {
  private persistentMovieStorage: MovieDetails[];
  private persistentMovieStorageIndexes: Map<number, number>;
  private operationalMovieStorage: Readonly<Movie[]>;
  private helpInfoStorage: HelpInfoStorage;

  constructor(movieDbPath: string, helperDbPaths?: HelperStoragePaths) {
    // Initialize persitentMovieStorage from JSON DB
    const readData = JSON.parse(
      fs.readFileSync(movieDbPath) as unknown as string
    ); // ???
    this.persistentMovieStorage = readData.movies;

    // Initialize persistentMovieStorageIndexes
    this.persistentMovieStorageIndexes = new Map();
    for (let i = 0; i < this.persistentMovieStorage.length; i++) {
      const movieId = this.persistentMovieStorage[i].id;
      this.persistentMovieStorageIndexes.set(movieId, i);
    }

    // Initialize operationalMovieStorage taking only needed data from persistentMovieStorage
    this.operationalMovieStorage = this.persistentMovieStorage.reduce(
      (final: Movie[], movie) => {
        if (!movie.adult && movie.cast && movie.crew && movie.runtime >= 60)
          final.push({
            id: movie.id,
            budget: movie.budget,
            original_language: movie.original_language,
            title: movie.title,
            popularity: movie.popularity,
            release_date: movie.release_date,
            revenue: movie.revenue,
            runtime: movie.runtime,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            genre_ids: movie.genre_ids,
            production_company_ids: movie.production_company_ids,
            cast: movie.cast,
            crew: movie.crew,
            keyword_ids: movie.keyword_ids,
            backdrop_path: movie.backdrop_path,
            director: movie.director,
          });
        return final;
      },
      []
    );

    // Initialize helpInfoStorage iterating through paths and reading additional JSON DB files
    this.helpInfoStorage = {};
    if (helperDbPaths) {
      Object.entries(helperDbPaths).forEach(([label, path]) => {
        const readData = JSON.parse(fs.readFileSync(path) as unknown as string);
        if (isHelperStorageLabel(label)) {
          this.helpInfoStorage[label] = readData[label];
          console.log(`Helper storage with for ${label} initialized`);
        }
      });
    }
  }

  // Methods for manipulations with persistentMovieStorage
  getFullMovieDetailsById = (id: number): MovieDetails | undefined => {
    const index = this.persistentMovieStorageIndexes.get(id);
    return typeof index !== "undefined"
      ? this.persistentMovieStorage[index]
      : undefined;
  };

  getFullMovieDetailsByTitle = (title: string): MovieDetails | undefined => {
    const movie = this.operationalMovieStorage.find(
      (movie) => movie.title === title
    );
    return typeof movie !== "undefined"
      ? this.getFullMovieDetailsById(movie.id)
      : undefined;
  };

  appendToPersistentMovieStorage = (
    data: MovieDetails | MovieDetails[]
  ): boolean => {
    const initialLength = this.persistentMovieStorage.length;
    if (Array.isArray(data)) {
      for (const movie of data) {
        this.addMovieToPersistentStorage(movie);
      }
    } else this.addMovieToPersistentStorage(data);
    return this.persistentMovieStorage.length > initialLength;
  };

  private addMovieToPersistentStorage = (movie: MovieDetails) => {
    if (!this.persistentMovieStorageIndexes.get(movie.id)) {
      this.persistentMovieStorage.push(movie);
      this.persistentMovieStorageIndexes.set(
        movie.id,
        this.persistentMovieStorage.length - 1
      );
      return true;
    } else {
      console.log("The movie is already in storage");
      return false;
    }
  };

  writePersistentStorageToDB = (): void => {
    const dataToWrite = JSON.stringify({ movies: this.persistentMovieStorage });
    fs.writeFile(`../json_db/${Date.now()}_movies.json`, dataToWrite, () => {
      throw new Error("DB is not updated");
    });
    console.log("DB is updated");
  };

  // Get full operationalStorage
  getAllMovies = (): Readonly<Movie[]> => this.operationalMovieStorage;

  // Methods for manipulations with HelpInfoStorage
  getDetailsById = (
    storageLabel: HelperStorageLabel,
    id: number | string
  ): Details | undefined => {
    const neededStorage = this.helpInfoStorage[storageLabel];
    if (neededStorage) {
      return neededStorage.find((item) => item.id == id);
    } else console.log(`There is no storage with such label: ${storageLabel}`);
  };

  getStorageLabels = (): HelperStorageLabel[] =>
    Object.keys(this.helpInfoStorage).filter(isHelperStorageLabel);

  appendToHelpInfoStorage = (
    storageLabel: HelperStorageLabel,
    data: Details | Details[]
  ): boolean => {
    const neededStorage = this.helpInfoStorage[storageLabel];
    if (neededStorage) {
      const initialLength = neededStorage.length;
      if (Array.isArray(data)) {
        neededStorage.push(...data);
      } else neededStorage.push(data);
      return neededStorage.length > initialLength;
    } else {
      console.log("There is no such storage");
      return false;
    }
  };

  writeHelpInfoStorageToDB = (
    storageLabel: HelperStorageLabel
  ): void | Error => {
    const dataToWrite = JSON.stringify({
      [storageLabel]: this.helpInfoStorage[storageLabel],
    });
    fs.writeFile(
      `../json_db/${Date.now()}_${storageLabel}.json`,
      dataToWrite,
      () => {
        throw new Error("DB is not updated");
      }
    );
    console.log(`${storageLabel} DB is updated`);
  };
}
