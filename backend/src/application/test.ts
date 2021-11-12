import axios from "axios";

const test = async () => {
  const genre = 37;

  const response = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=f8e2536d2a6c29addf08e0d0866cafc8&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&vote_count.gte=1000&with_genres=${genre}&with_watch_monetization_types=flatrate`
  );
  const urls = response.data.results.map((movie: any) => movie.backdrop_path);
  console.log(urls);
};

test();
