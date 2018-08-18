"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandHasAlreadyBeenTouchedError {
    constructor(command) {
        this.name = 'CommandHasAlreadyBeenTouched';
        this.message = `The command "${command}" has already been touched by another App.`;
    }
}
exports.CommandHasAlreadyBeenTouchedError = CommandHasAlreadyBeenTouchedError;

//# sourceMappingURL=CommandHasAlreadyBeenTouchedError.js.map
