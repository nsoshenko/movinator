// Incapsulation of TMDB API details
import axios from "axios";

const instance = axios.create();
instance.defaults.baseURL = "https://api.themoviedb.org/3";

export default class TmdbApi {
  instance = instance;
  key = process.env.API_KEY;
}
