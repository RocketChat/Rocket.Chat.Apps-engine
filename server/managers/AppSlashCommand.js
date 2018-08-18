"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../../definition/metadata");
class AppSlashCommand {
    constructor(app, slashCommand) {
        this.app = app;
        this.slashCommand = slashCommand;
        this.isRegistered = false;
        this.isEnabled = false;
        this.isDisabled = false;
    }
    hasBeenRegistered() {
        this.isDisabled = false;
        this.isEnabled = true;
        this.isRegistered = true;
    }
    canBeRan(method) {
        return this.app.hasMethod(method);
    }
    runExecutorOrPreviewer(method, context, logStorage, accessors) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.runTheCode(method, logStorage, accessors, context, new Array());
        });
    }
    runPreviewExecutor(previewItem, context, logStorage, accessors) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runTheCode(metadata_1.AppMethod._COMMAND_PREVIEW_EXECUTOR, logStorage, accessors, context, [previewItem]);
            return;
        });
    }
    runTheCode(method, logStorage, accessors, context, runContextArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = this.slashCommand.command;
            // Ensure the slash command has the property before going on
            if (typeof this.slashCommand[method] !== 'function') {
                return;
            }
            const runContext = this.app.makeContext({
                slashCommand: this.slashCommand,
                args: [
                    ...runContextArgs,
                    context,
                    accessors.getReader(this.app.getID()),
                    accessors.getModifier(this.app.getID()),
                    accessors.getHttp(this.app.getID()),
                    accessors.getPersistence(this.app.getID()),
                ],
            });
            const logger = this.app.setupLogger(method);
            logger.debug(`${command}'s ${method} is being executed...`, context);
            let result;
            try {
                const runCode = `slashCommand.${method}.apply(slashCommand, args)`;
                result = yield this.app.runInContext(runCode, runContext);
                logger.debug(`${command}'s ${method} was successfully executed.`);
            }
            catch (e) {
                logger.error(e);
                logger.debug(`${command}'s ${method} was unsuccessful.`);
            }
            try {
                yield logStorage.storeEntries(this.app.getID(), logger);
            }
            catch (e) {
                // Don't care, at the moment.
                // TODO: Evaluate to determine if we do care
            }
            return result;
        });
    }
}
exports.AppSlashCommand = AppSlashCommand;

//# sourceMappingURL=AppSlashCommand.js.map
