// Required input for weighted randomizer
export type ValuesAndWeights = {
  [option: string | number]: number;
};

// Utility function to add some reasonable randomness to algo's decision making
export const weightedRandomizer = (obj: ValuesAndWeights): string => {
  const initialValues = Object.keys(obj);
  const initialWeights = Object.values(obj);
  const initialValuesLength = initialValues.length; // not to compute for every if check

  if (initialValuesLength === 0)
    throw new Error("Empty input passed to randomizer function");
  if (initialValuesLength !== initialWeights.length)
    throw new Error("Corrupted input passed to randomizer function");

  // Log randomizer input if it's relatively small
  console.log("START RANDOMIZING");
  if (initialValuesLength <= 10) console.log(obj);

  if (initialValuesLength === 1) return initialValues[0];

  const cumulativeArray = initialWeights.reduce(
    (final: number[], current: number, index) => {
      const nextCumulativeWeight = current + (final[index - 1] || 0);
      final.push(nextCumulativeWeight);
      return final;
    },
    []
  );
  const randomNumber =
    Math.random() * cumulativeArray[cumulativeArray.length - 1];

  for (const i in cumulativeArray) {
    if (cumulativeArray[i] >= randomNumber) {
      console.log("RANDOMLY CHOSEN VALUE");
      console.log(initialValues[i]);
      return initialValues[i];
    }
  }
  console.log(`Random number: ${randomNumber}`);
  console.log(`Cumulative array: ${cumulativeArray}`);
  throw new Error("No random number was chosen from cumulative array");
};
