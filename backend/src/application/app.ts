import express, { Application, Request, Response } from "express";
import cors from "cors";
import {
  questionGetHandler,
  questionPostHandler,
  sessionCheckHandler,
  sessionCloseHandler,
  similarMovieHandler,
} from "./main";
import { downloadStorage } from "../utils/dropbox";
import { optionsCounter } from "./optionsCounter";
import MovieStorage from "../storage/Storage";
import { Options } from "./types/types";
import SessionStorage from "../storage/SessionStorage";

const app: Application = express();
const port = 3002;

// Body parsing middleware
app.use(express.json());
app.use(cors());

(async () => {
  // Initialize in-mem storage from JSON files downloaded from Dropbox
  const movieStorage: MovieStorage = await downloadStorage().then(() => {
    return new MovieStorage(process.env.MOVIE_DB_PATH as string, {
      genres: process.env.GENRES_DB_PATH,
      people: process.env.PEOPLE_DB_PATH,
      production_companies: process.env.PRODUCTION_COMPANIES_DB_PATH,
      keywords: process.env.KEYWORDS_DB_PATH,
    });
  });
  // const movieStorage: MovieStorage = await MovieStorage.buildOnline();

  const allSessionsStorage: SessionStorage = new SessionStorage();

  // Needed not to do a full optionsCounter on each session start
  const defaultOptions: Options = await optionsCounter(
    movieStorage.getAllMovies()
  );

  try {
    app.listen(port, (): void => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err: any) {
    console.error(`Error occured ${err.message}`);
  }

  app.get(
    "/api/question",
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const response = await questionGetHandler(
          allSessionsStorage,
          defaultOptions,
          movieStorage
        );
        console.log(response);
        return res.status(200).send({
          ...response,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong");
      }
    }
  );

  app.post(
    "/api/question",
    async (req: Request, res: Response): Promise<Response> => {
      // Log request
      console.log(req.body.sessionId || "No session ID from React");
      console.log(req.body.question || "No answer data from React");

      // Validate request
      const bodyValidation = Object.keys(req.body);
      if (bodyValidation.length === 0)
        return res.status(500).send("Empty POST request");
      if (!bodyValidation.includes("sessionId"))
        return res.status(500).send("No session ID in request");
      if (Number(req.body.sessionId) <= 0)
        return res.status(500).send("Wrong session ID format");

      // Process request
      try {
        const response = await questionPostHandler(
          req.body,
          allSessionsStorage,
          defaultOptions,
          movieStorage
        );
        console.log(response);
        return res.status(200).send({
          ...response,
        });
      } catch (err) {
        console.error(err);
        return res.status(404).send(err);
      }
    }
  );

  app.post(
    "/api/check",
    async (req: Request, res: Response): Promise<Response> => {
      console.log("Request to check existing session");
      try {
        const response = await sessionCheckHandler(
          req.body,
          allSessionsStorage
        );
        console.log(response);
        return res.status(200).send({
          ...response,
        });
      } catch (err) {
        console.log(err);
        return res.status(404).send(err);
      }
    }
  );

  app.post(
    "/api/close",
    async (req: Request, res: Response): Promise<Response> => {
      console.log("Request to close session");
      try {
        const response = await sessionCloseHandler(
          req.body,
          allSessionsStorage
        );
        console.log(response);
        return res.status(200).send({ ...response });
      } catch (err) {
        console.log(err);
        return res.status(404).send(err);
      }
    }
  );

  app.post(
    "/api/similar",
    async (req: Request, res: Response): Promise<Response> => {
      console.log("Request for similar movie");
      try {
        const response = await similarMovieHandler(
          req.body,
          allSessionsStorage,
          movieStorage
        );
        console.log(response);
        return res.status(200).send({
          ...response,
        });
      } catch (err) {
        console.log(err);
        return res.status(404).send(err);
      }
    }
  );
})();
