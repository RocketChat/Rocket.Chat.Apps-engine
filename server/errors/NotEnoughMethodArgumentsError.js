"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotEnoughMethodArgumentsError {
    constructor(method, requiredCount, providedCount) {
        this.name = 'NotEnoughMethodArgumentsError';
        this.message = `The method "${method}" requires `
            + `${requiredCount} parameters but was only passed ${providedCount}.`;
    }
}
exports.NotEnoughMethodArgumentsError = NotEnoughMethodArgumentsError;

//# sourceMappingURL=NotEnoughMethodArgumentsError.js.map
