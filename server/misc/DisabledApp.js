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
const App_1 = require("../../definition/App");
const metadata_1 = require("../../definition/metadata");
const logging_1 = require("../logging");
class DisabledApp extends App_1.App {
    static createNew(info, status) {
        return new DisabledApp(info, new logging_1.AppConsole(metadata_1.AppMethod._CONSTRUCTOR), status);
    }
    constructor(info, logger, status) {
        super(info, logger);
        this.setStatus(status);
    }
    onEnable() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    getLogger() {
        return super.getLogger();
    }
}
exports.DisabledApp = DisabledApp;

//# sourceMappingURL=DisabledApp.js.map
