import { Session } from "../storage/SessionStorage";
import { weightedRandomizer, ValuesAndWeights } from "../utils/utils";
import { optionsCounter } from "./optionsCounter";
import { QUESTION_TYPE_COUNT } from "./types/constants";
import {
  Question,
  QuestionType,
  Options,
  QuestionCandidate,
  QuestionCandidateWithDetails,
  OptionsEntries,
  QuestionNeedsDetails,
  Option,
  doesQuestionNeedDetails,
} from "./types/types";
import TmdbApi from "./tmdbApi";
import MovieStorage from "../storage/Storage";
import { Details, GenreDetails } from "../../domain/types/types";
import { BannedQuestionOptions, HelperStorageLabel } from "../storage/types";
import { questionTypeToEndpoint, TmdbEndpoint } from "./types/mappings";

var questionIdCounter = 1; // Needed to generate questionIds
const api = new TmdbApi();

// Question factory flow
export const questionFactory = async (
  defaultOptions: Options,
  movieStorage: MovieStorage,
  session: Session
): Promise<Question | undefined> => {
  // Check if there are available question types in the pool and reset bans in other case
  if (areAllQuestionsBanned(session, QUESTION_TYPE_COUNT))
    session.resetTempoBannedQuestionTypes();

  // Get all banned question types not to count them
  const notNeededQuestionTypes: Set<QuestionType> =
    session.getAllBannedQuestionTypes();

  // Count all the available question types and options
  const options: Options = session.isMovieStorageEmpty()
    ? defaultOptions
    : await optionsCounter(session.getMovies(), notNeededQuestionTypes);

  // Remove banned options from the pool
  const cleanedOptions: Options = removeBannedOptions(
    options,
    session.getBannedQuestionOptions()
  );

  // Choose best candidate for each question type
  const bestCandidates: QuestionCandidate[] =
    chooseBestCandidatePerQuestionType(cleanedOptions);
  console.log("BEST CANDIDATES");
  console.log(bestCandidates);

  // Choose question type and options from candidates
  const chosenCandidate = chooseQuestionType(bestCandidates);
  console.log("CHOSEN CANDIDATE");
  console.log(chosenCandidate);

  if (chosenCandidate) {
    // Query data from DB or API if question needs it
    const questionDetails = doesQuestionNeedDetails(chosenCandidate[0])
      ? await getQuestionDetails(
          movieStorage,
          chosenCandidate[0] as QuestionNeedsDetails,
          chosenCandidate[2]
        )
      : createOptionNames(chosenCandidate[2]);

    // Append details from DB/API or created manually
    const candidateWithDetails: QuestionCandidateWithDetails = [
      chosenCandidate[0],
      chosenCandidate[1],
      questionDetails as [Option, Option],
    ];
    console.log("CANDIDATE WITH DETAILS");
    console.log(candidateWithDetails);

    // Ban both used question options
    session.banQuestionOption(chosenCandidate[0], chosenCandidate[2][0]);
    session.banQuestionOption(chosenCandidate[0], chosenCandidate[2][1]);

    // Format question to expected output
    const question = questionFormatter(candidateWithDetails);
    return question;
  } else {
    console.log("No question was chosen");
    return undefined;
  }
};

// Question factory helper functions
const areAllQuestionsBanned = (
  session: Session,
  maxNumberOfQuestionTypes: number
): boolean => {
  return session.getAllBannedQuestionTypesSize() >= maxNumberOfQuestionTypes;
};

// Removes options, which are contained in banned list in order not to operate with them further
const removeBannedOptions = (
  inputOptions: Options,
  bannedOptions: BannedQuestionOptions
): Options => {
  // Check if there is any option to ban
  if (Object.keys(bannedOptions).length === 0) {
    console.log("No options to ban");
    return inputOptions;
  }

  // Copy inputOptions array and remove all intersections with banned
  const cleanedOptions = (
    Object.entries(inputOptions) as OptionsEntries
  ).reduce((final, [optionType, options]): Options => {
    if (!bannedOptions[optionType]) return final;
    const optionValues = Object.keys(options);
    for (const value of optionValues) {
      if (bannedOptions[optionType]!.has(value) && final[optionType])
        delete final[optionType]![value];
    }

    // Remove object for optionType if no options left inside
    if (final[optionType]) {
      if (Object.keys(final[optionType]!).length === 0) {
        console.log(`All options from type ${optionType} were removed`);
        delete final[optionType];
      }
    }
    return final;
  }, inputOptions);
  return cleanedOptions;
};

const chooseBestCandidatePerQuestionType = (
  options: Options
): QuestionCandidate[] => {
  const candidates = (Object.entries(options) as OptionsEntries).reduce(
    (final: QuestionCandidate[], [optionType, optionValues]) => {
      const chosenOptions = [];
      const optionValuesKeys = Object.keys(optionValues);
      if (optionValuesKeys.length < 2) return final;
      else if (optionValuesKeys.length === 2) {
        chosenOptions.push(...[optionValuesKeys[0], optionValuesKeys[1]]);
      } else if (optionValuesKeys.length > 2) {
        const randomOptionOne = weightedRandomizer(optionValues)!;
        do {
          var randomOptionTwo = weightedRandomizer(optionValues)!;
        } while (randomOptionOne === randomOptionTwo);
        chosenOptions.push(...[randomOptionOne, randomOptionTwo]);
      }
      if (chosenOptions.length === 2) {
        const typeWeight =
          optionValues[chosenOptions[0]!] + optionValues[chosenOptions[1]!];
        final.push([optionType, typeWeight, chosenOptions as [string, string]]);
      }
      return final;
    },
    []
  );
  return candidates;
};

const chooseQuestionType = (
  candidates: QuestionCandidate[]
): QuestionCandidate | undefined => {
  if (candidates.length === 0) {
    console.log("No candidates to choose from");
    return undefined;
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  const optionsToRandomize: ValuesAndWeights = {};
  for (const candidate of candidates) {
    optionsToRandomize[candidate[0]] = candidate[1];
  }

  const randomOption = weightedRandomizer(optionsToRandomize);
  const chosenOption = candidates.find(
    (candidate) => candidate[0] === randomOption
  );
  console.log(`Randomly chosen option: ${chosenOption}`);
  return chosenOption;
};

const getQuestionDetails = async (
  movieStorage: MovieStorage,
  type: QuestionNeedsDetails,
  options: [string, string]
): Promise<[Option, Option]> => {
  console.log("NEED TO GET DETAILS");
  const optionPromises = options.map(
    async (id) => await getOptionDetailsWithFallback(movieStorage, type, id)
  );
  const detailedOptions = await Promise.all(optionPromises);
  return detailedOptions as [Option, Option];
};

// Wraps fallback mechanism querying API after in-mem storage if needed
const getOptionDetailsWithFallback = async (
  movieStorage: MovieStorage,
  type: QuestionNeedsDetails,
  id: string
): Promise<Option | undefined> => {
  try {
    const storageLabel = type === "cast" || type === "crew" ? "people" : type;
    const optionDetails = await getOptionDetailsFromInternalStorage(
      movieStorage,
      storageLabel,
      id
    );
    return { id: optionDetails.id, name: optionDetails.name };
  } catch (error) {
    console.log(error);
    try {
      const endpoint = questionTypeToEndpoint[type];
      const optionDetails = await getOptionDetailsFromApi(type, endpoint, id);
      if (optionDetails)
        return { id: optionDetails.id, name: optionDetails.name };
    } catch (error) {
      console.log(error);
    }
  }
};

// Queries details of entity by ID from in-mem storage (rejects promise in case of failure)
const getOptionDetailsFromInternalStorage = async (
  movieStorage: MovieStorage,
  storageLabel: HelperStorageLabel,
  id: string
): Promise<Details> => {
  return new Promise((resolve, reject) => {
    const optionDetails = movieStorage.getDetailsById(storageLabel, id);
    if (optionDetails) resolve(optionDetails);
    else
      reject(
        `Can't find details for ${storageLabel}: ${id} in internal storage`
      );
  });
};

// Queries details of entity by ID from API in case it's missing in in-mem storage
const getOptionDetailsFromApi = async (
  type: QuestionNeedsDetails,
  endpoint: TmdbEndpoint,
  optionId: string
): Promise<Details | undefined> => {
  // let optionDetails = {};
  if (type === "genres") {
    const requestUrl = `${endpoint}?api_key=${api.key}`;
    try {
      const response = await api.instance.get(requestUrl);
      const optionDetails = (
        response.data[Object.keys(response.data)[0]] as GenreDetails[]
      ).find(({ id }) => id.toString() === optionId);
      if (optionDetails) return optionDetails;
    } catch (error) {
      console.log(error);
    }
  } else {
    const requestUrl = `${endpoint}/${optionId}?api_key=${api.key}`;
    try {
      const response = await api.instance.get(requestUrl);
      const optionDetails = response.data as Details;
      return optionDetails;
    } catch (error) {
      console.log(error);
    }
  }
  // if (optionDetails && Object.keys(optionDetails).length > 0) {
  //   if (questionType === "cast" || questionType === "crew") {
  //     ds.helperStorages.people.push(optionDetails);
  //   } else ds.helperStorages[questionType].push(optionDetails);
  //   // to implement async writing of the updated storage to DB
  // }
};

const createOptionNames = (options: string[]): Option[] =>
  options.map((option) => {
    return {
      id: option,
      name: option,
    };
  });

const questionFormatter = (
  candidate: QuestionCandidateWithDetails
): Question => {
  const question = {
    id: generateQuestionId(),
    type: candidate[0],
    options: [
      candidate[2][0],
      candidate[2][1],
      { id: 0, name: "Other" } as Option,
    ],
  };
  for (const option of question.options) {
    option.selected = false;
  }
  return question as Question;
};

// Increments and returns global variable questionId
const generateQuestionId = () => questionIdCounter++;

// const doesQuestionNeedDetails = (type: QuestionType): boolean => {
//   const needDetails = [
//     "genres",
//     "cast",
//     "crew",
//     "production_companies",
//     "keywords",
//   ];
//   return needDetails.includes(type);
// };
