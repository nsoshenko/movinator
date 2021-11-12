import { Details } from "../domain/types/types";
import { QuestionType } from "../application/types/types";

// Storage types
export type HelperStorageLabel =
  | "genres"
  | "people"
  | "production_companies"
  | "keywords";

export const isHelperStorageLabel = (
  label: string
): label is HelperStorageLabel => {
  const validLabels: HelperStorageLabel[] = [
    "genres",
    "people",
    "production_companies",
    "keywords",
  ];
  return validLabels.includes(label as HelperStorageLabel);
};

export type HelpInfoStorage = {
  [K in HelperStorageLabel]?: Details[];
};

export type HelperStoragePaths = {
  [K in HelperStorageLabel]?: string;
};

export type BannedQuestionTypes = Set<QuestionType>;

export type BannedQuestionOptions = {
  [K in QuestionType]?: Set<string | number>;
};
