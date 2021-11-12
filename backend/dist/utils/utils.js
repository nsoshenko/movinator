"use strict";
// Universal utility functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightedRandomizer = void 0;
// Utility function to add some reasonable randomness to algo's decision making
var weightedRandomizer = function (obj) {
    var initialValues = Object.keys(obj);
    var initialWeights = Object.values(obj);
    var initialValuesLength = initialValues.length; // not to compute for every if check
    if (initialValuesLength === 0)
        throw new Error("Empty input passed to randomizer function");
    if (initialValuesLength !== initialWeights.length)
        throw new Error("Corrupted input passed to randomizer function");
    // Log randomizer input if it's relatively small
    console.log("START RANDOMIZING");
    if (initialValuesLength <= 10)
        console.log(obj);
    if (initialValuesLength === 1)
        return initialValues[0];
    var cumulativeArray = initialWeights.reduce(function (final, current, index) {
        var nextCumulativeWeight = current + (final[index - 1] || 0);
        final.push(nextCumulativeWeight);
        return final;
    }, []);
    var randomNumber = Math.random() * cumulativeArray[cumulativeArray.length - 1];
    for (var i in cumulativeArray) {
        if (cumulativeArray[i] >= randomNumber) {
            console.log("RANDOMLY CHOSEN VALUE");
            console.log(initialValues[i]);
            return initialValues[i];
        }
    }
    console.log("Random number: " + randomNumber);
    console.log("Cumulative array: " + cumulativeArray);
    throw new Error("No random number was chosen from cumulative array");
};
exports.weightedRandomizer = weightedRandomizer;
//# sourceMappingURL=utils.js.map