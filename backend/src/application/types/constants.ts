// Constants
export const QUESTION_TYPE_COUNT = 6 as const; // Needed to reset temporary banned questions if no available types left
export const MIN_VOTE_COUNT_FOR_RATING = 50 as const; // From what vote_count rating becomes relevant
export const READY_TO_FINISH_THRESHOLD = 10 as const; // Which number of movies is enough to stop narrowing and pick one
