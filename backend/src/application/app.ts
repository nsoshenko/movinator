import express, { Application, Request, Response } from "express";
import cors from "cors";
import {
  initializeDefaultCounters,
  questionGetHandler,
  questionPostHandler,
  sessionCheckHandler,
  similarMovieHandler,
} from "./main";

const app: Application = express();
const port = 3002;

// Body parsing middleware
app.use(express.json());
app.use(cors());

try {
  app.listen(port, (): void => {
    initializeDefaultCounters();
    console.log(`Server is running on port ${port}`);
  });
} catch (err: any) {
  console.error(`Error occured ${err.message}`);
}

app.get(
  "/api/question",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const response = await questionGetHandler();
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
      const response = await questionPostHandler(req.body);
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
      const response = await sessionCheckHandler(req.body);
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
  "/api/similar",
  async (req: Request, res: Response): Promise<Response> => {
    console.log("Request for similar movie");
    try {
      const response = await similarMovieHandler(req.body);
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
