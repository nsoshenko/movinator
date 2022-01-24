import { PrismaClient } from "@prisma/client";
import { Movie, MovieDetails } from "../../domain/types/types";

const prisma = new PrismaClient();

export const getMovieDetailsFromDbById = async (
  id: number
): Promise<MovieDetails> =>
  prisma.movie.findUnique({
    where: {
      id: id,
    },
  }) as unknown as Promise<MovieDetails>;

export const getMovieDetailsFromDbByTitle = async (title: string) => {
  prisma.movie.findFirst({
    where: {
      title: title,
    },
  });
};

// This method gets movies iteratively to consume less RAM
export const getAllMoviesMetadata = async () => {
  const step = 50000; // iteration size
  let movies: Movie[] = [];
  for (
    let i = 0, cursor: number | undefined = undefined;
    i < 225246;
    i += step, cursor = movies[movies.length - 1].id
  ) {
    const chunk = !cursor
      ? await prisma.movie.findMany({
          where: {
            AND: {
              adult: false,
              runtime: {
                gte: 50,
              },
              NOT: {
                production_company_ids: {
                  has: 6695,
                },
              },
            },
          },
          select: {
            id: true,
            original_language: true,
            title: true,
            popularity: true,
            release_date: true,
            vote_average: true,
            vote_count: true,
            genre_ids: true,
            production_company_ids: true,
            cast: true,
            crew: true,
            keyword_ids: true,
            backdrop_path: true,
          },
          take: step,
        })
      : await prisma.movie.findMany({
          where: {
            AND: {
              adult: false,
              runtime: {
                gte: 50,
              },
              NOT: {
                production_company_ids: {
                  has: 6695,
                },
              },
            },
          },
          select: {
            id: true,
            original_language: true,
            title: true,
            popularity: true,
            release_date: true,
            vote_average: true,
            vote_count: true,
            genre_ids: true,
            production_company_ids: true,
            cast: true,
            crew: true,
            keyword_ids: true,
            backdrop_path: true,
          },
          cursor: {
            id: cursor,
          },
          take: step,
        });
    movies = movies.concat(chunk as unknown as Movie);
    console.log(movies.length);
  }

  // Remove duplicates for whatever reason (~1ms runtime)
  const ids = new Set();
  for (let i = 0; i < movies.length; i++) {
    if (ids.has(movies[i].id)) {
      [movies[i], movies[movies.length - 1]] = [
        movies[movies.length - 1],
        movies[i],
      ];
      movies.pop();
      i--;
    } else ids.add(movies[i].id);
  }
  return movies;
};
