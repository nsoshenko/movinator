import axios from "axios";
import { Question } from "../types/types";

// Route
const movinatorApiUrl = "https://movinator.lhr.rocks/api";

// Requests
export const getFirstQuestion = async () =>
  axios.get(movinatorApiUrl + "/question");

export const getNextQuestionOrResult = async (
  sessionId: string,
  questionData?: Question
) =>
  axios.post(movinatorApiUrl + "/question", {
    sessionId: sessionId,
    question: questionData,
  });

export const getResult = async (sessionId: string) =>
  axios.post(movinatorApiUrl + "/question", {
    sessionId: sessionId,
  });

export const getSimilarMovie = async (sessionId: string) =>
  axios.post(movinatorApiUrl + "/similar", { sessionId: sessionId });

export const checkSession = async (sessionId: string) =>
  axios.post(movinatorApiUrl + "/check", {
    sessionId: sessionId,
  });

export const closeSession = async (sessionId: string) =>
  axios.post(movinatorApiUrl + "/close", {
    sessionId: sessionId,
  });
