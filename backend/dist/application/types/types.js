"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAnswerRequest = exports.isResultResponse = exports.doesQuestionNeedDetails = void 0;
var doesQuestionNeedDetails = function (type) {
    var validLabels = [
        "genres",
        "cast",
        "crew",
        "production_companies",
        "keywords",
    ];
    return validLabels.includes(type);
};
exports.doesQuestionNeedDetails = doesQuestionNeedDetails;
var isResultResponse = function (response) {
    return response.result !== undefined;
};
exports.isResultResponse = isResultResponse;
var isAnswerRequest = function (request) {
    return request.question !== undefined;
};
exports.isAnswerRequest = isAnswerRequest;
//# sourceMappingURL=types.js.map