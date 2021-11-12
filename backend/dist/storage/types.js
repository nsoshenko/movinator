"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHelperStorageLabel = void 0;
var isHelperStorageLabel = function (label) {
    var validLabels = [
        "genres",
        "people",
        "production_companies",
        "keywords",
    ];
    return validLabels.includes(label);
};
exports.isHelperStorageLabel = isHelperStorageLabel;
//# sourceMappingURL=types.js.map