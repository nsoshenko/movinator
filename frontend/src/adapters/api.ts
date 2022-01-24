import axios from "axios";
import { Question } from "../types/types";

// Route
const movinatorApi = axios.create();
movinatorApi.defaults.baseURL = "http://192.168.1.84:3002/api";

// Requests
export const getFirstQuestion = async () => movinatorApi.get("/question");

export const getNextQuestionOrResult = async (
  sessionId: string,
  questionData?: Question
) =>
  movinatorApi.post("/question", {
    sessionId: sessionId,
    question: questionData,
  });

export const getResult = async (sessionId: string) =>
  movinatorApi.post("/question", {
    sessionId: sessionId,
  });

export const getSimilarMovie = async (sessionId: string) =>
  movinatorApi.post("/similar", { sessionId: sessionId });

export const checkSession = async (sessionId: string) =>
  movinatorApi.post("/check", {
    sessionId: sessionId,
  });

export const closeSession = async (sessionId: string) =>
  movinatorApi.post("/close", {
    sessionId: sessionId,
  });
