// Class with implemenation of in-memory storage and its operations
import fs from "fs";
import { getAllMoviesMetadata } from "../application/adapters/prismaDb";
import { MovieDetails, Movie, Details } from "../domain/types/types";
import {
  HelpInfoStorage,
  HelperStoragePaths,
  isHelperStorageLabel,
  HelperStorageLabel,
} from "./types";

export default class MovieStorage {
  private operationalMovieStorage: Readonly<Movie[]>;
  private helpInfoStorage: HelpInfoStorage;

  constructor(moviesDb: Movie[], helperDbPaths?: HelperStoragePaths) {
    // Initialize operationalMovieStorage taking only needed data from persistentMovieStorage
    this.operationalMovieStorage = moviesDb;

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

  // // Build method from Online storage
  static buildOnline = async (): Promise<MovieStorage> => {
    return new MovieStorage(await getAllMoviesMetadata());
  };

  // private static downloadMoviesData = async (): Promise<any> => {
  //   const dropbox = dropboxV2Api.authenticate({
  //     token: "s6qmSdeP0toAAAAAAAAAAXgXGysEi2_UPg1QOTfQb1M6W-VV_D6kiioEBzgp8HqX",
  //   });

  //   return new Promise((resolve, reject) => {
  //     const fileStreamObject = dropbox({
  //       resource: "files/download",
  //       parameters: {
  //         path: "/json_db/dev_movies.json",
  //       },
  //     });
  //     const jsonStreamObject = StreamObject.withParser();
  //     fileStreamObject.pipe(jsonStreamObject.input);
  //     let data = {};
  //     const startTime = Date.now();

  //     // 3 GB RAM
  //     jsonStreamObject.on("data", (chunk: any) => {
  //       data = { [chunk.key]: chunk.value };
  //     });

  //     jsonStreamObject.on("error", (err: Error) => {
  //       reject(err);
  //     });

  //     return jsonStreamObject.on("end", () => {
  //       // fileStreamObject.close();
  //       if (global.gc) global.gc();
  //       console.log(
  //         "Object: READING IS DONE: " + (Date.now() - startTime) / 1000 + " ms"
  //       );
  //       // console.log(data.movies.length);
  //       resolve(data);
  //     });
  //   });
  // };

  // Methods for manipulations with persistentMovieStorage
  // getFullMovieDetailsById = (id: number): MovieDetails | undefined => {
  //   const index = this.persistentMovieStorageIndexes.get(id);
  //   return typeof index !== "undefined"
  //     ? this.persistentMovieStorage[index]
  //     : undefined;
  // };

  // getFullMovieDetailsByTitle = (title: string): MovieDetails | undefined => {
  //   const movie = this.operationalMovieStorage.find(
  //     (movie) => movie.title === title
  //   );
  //   return typeof movie !== "undefined"
  //     ? this.getFullMovieDetailsById(movie.id)
  //     : undefined;
  // };

  // appendToPersistentMovieStorage = (
  //   data: MovieDetails | MovieDetails[]
  // ): boolean => {
  //   const initialLength = this.persistentMovieStorage.length;
  //   if (Array.isArray(data)) {
  //     for (const movie of data) {
  //       this.addMovieToPersistentStorage(movie);
  //     }
  //   } else this.addMovieToPersistentStorage(data);
  //   return this.persistentMovieStorage.length > initialLength;
  // };

  // private addMovieToPersistentStorage = (movie: MovieDetails) => {
  //   if (!this.persistentMovieStorageIndexes.get(movie.id)) {
  //     this.persistentMovieStorage.push(movie);
  //     this.persistentMovieStorageIndexes.set(
  //       movie.id,
  //       this.persistentMovieStorage.length - 1
  //     );
  //     return true;
  //   } else {
  //     console.log("The movie is already in storage");
  //     return false;
  //   }
  // };

  // writePersistentStorageToDB = (): void => {
  //   const dataToWrite = JSON.stringify({ movies: this.persistentMovieStorage });
  //   fs.writeFile(`../json_db/${Date.now()}_movies.json`, dataToWrite, () => {
  //     throw new Error("DB is not updated");
  //   });
  //   console.log("DB is updated");
  // };

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
