"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MustContainFunctionError {
    constructor(fileName, funcName) {
        this.name = 'MustContainFunction';
        this.message = `The App (${fileName}) doesn't have a "${funcName}" function which is required.`;
    }
}
exports.MustContainFunctionError = MustContainFunctionError;

//# sourceMappingURL=MustContainFunctionError.js.map
