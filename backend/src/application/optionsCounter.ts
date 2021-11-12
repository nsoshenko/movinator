import { Movie } from "../domain/types/types";
import { MIN_VOTE_COUNT_FOR_RATING } from "./types/constants";
import { QuestionType, Options } from "./types/types";

// Counts how many times each id of each entity encounters in global or session storage
// Can be simplified by passing notNeededTypes to ignore
export const optionsCounter = async (
  inputArr: readonly Movie[],
  notNeededTypes: Set<QuestionType> = new Set()
): Promise<Options> => {
  return new Promise((resolve) => {
    const options = inputArr.reduce((final: Options, current: Movie) => {
      // Count years (~160 ms)
      if (current.release_date && !notNeededTypes.has("years")) {
        const year = new Date(current.release_date).getFullYear();
        if (!final.years) final.years = {};
        if (!final.years[year]) final.years[year] = 0;
        final.years[year]++;
      }

      // Count ratings (~1 ms)
      if (current.vote_average && !notNeededTypes.has("ratings")) {
        if (current.vote_count >= MIN_VOTE_COUNT_FOR_RATING) {
          const rating = Math.floor(current.vote_average);
          if (!final.ratings) final.ratings = {};
          if (!final.ratings[rating]) final.ratings[rating] = 0;
          final.ratings[rating]++;
        }
      }

      // Count languages (~8 ms)
      if (current.original_language && !notNeededTypes.has("languages")) {
        const language = current.original_language;
        if (!final.languages) final.languages = {};
        if (!final.languages[language]) final.languages[language] = 0;
        final.languages[language]++;
      }

      // Count genres (~99 ms)
      if (current.genre_ids && !notNeededTypes.has("genres")) {
        if (!final.genres) final.genres = {};
        for (const genre of current.genre_ids) {
          if (!final.genres[genre]) final.genres[genre] = 0;
          final.genres[genre]++;
        }
      }

      // Count cast (~400 ms)
      if (current.cast && !notNeededTypes.has("cast")) {
        if (!final.cast) final.cast = {};
        for (const person of current.cast) {
          if (!final.cast[person]) final.cast[person] = 0;
          final.cast[person]++;
        }
      }

      // Count crew (~430 ms)
      // if (!final.crew) final.crew = {}
      // if (current.crew && !notNeededTypes.has("crew")) {
      //   for (const person of current.crew) {
      //     if (!final.crew[person]) final.crew[person] = 0;
      //     final.crew[person]++;
      //   }
      // }

      // Count companies (~4 ms)
      // if (
      //   current.production_company_ids &&
      //   !notNeededTypes.has("production_companies")
      // ) {
      //   if (!final.production_companies) final.production_companies = {}
      //   for (const company of current.production_company_ids) {
      //     if (!final.production_companies[company])
      //       final.production_companies[company] = 0;
      //     final.production_companies[company]++;
      //   }
      // }

      // Count keywords (~80 ms)
      if (current.keyword_ids && !notNeededTypes.has("keywords")) {
        if (!final.keywords) final.keywords = {};
        for (const keyword of current.keyword_ids) {
          if (!final.keywords[keyword]) final.keywords[keyword] = 0;
          final.keywords[keyword]++;
        }
      }

      return final;
    }, {});

    // console.log(options);
    resolve(options);
  });
};
