// Incapsulation of TMDB API details
import axios from "axios";
import { TmdbEndpoint } from "../types/mappings";

// Route & key
const tmdbApi = axios.create();
tmdbApi.defaults.baseURL = "https://api.themoviedb.org/3";
const key = process.env.TMDB_API_KEY;

// Requests
export const getRecommendationsForMovie = async (id: number) =>
  tmdbApi.get(`/movie/${id}/recommendations?api_key=${key}`);

export const getDetailsForEntity = async (
  entityType: TmdbEndpoint,
  id: number
) => tmdbApi.get(`${entityType}/${id}?api_key=${key}`);

export const getMovieGenresList = async () =>
  tmdbApi.get(`/genre/movie/list?api_key=${key}`);
