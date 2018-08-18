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
const MessageBuilder_1 = require("./MessageBuilder");
class Notifier {
    constructor(msgBridge, appId) {
        this.msgBridge = msgBridge;
        this.appId = appId;
    }
    notifyUser(user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.msgBridge.notifyUser(user, message, this.appId);
        });
    }
    notifyRoom(room, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.msgBridge.notifyRoom(room, message, this.appId);
        });
    }
    getMessageBuilder() {
        return new MessageBuilder_1.MessageBuilder();
    }
}
exports.Notifier = Notifier;

//# sourceMappingURL=Notifier.js.map
