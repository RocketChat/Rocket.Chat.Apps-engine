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
const AppServerCommunicator_1 = require("./AppServerCommunicator");
class AppClientManager {
    constructor(communicator) {
        this.communicator = communicator;
        if (!(communicator instanceof AppServerCommunicator_1.AppServerCommunicator)) {
            throw new Error('The communicator must extend AppServerCommunicator');
        }
        this.apps = new Array();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.apps = yield this.communicator.getEnabledApps();
            console.log('Enabled apps:', this.apps);
        });
    }
}
exports.AppClientManager = AppClientManager;

//# sourceMappingURL=AppClientManager.js.map
