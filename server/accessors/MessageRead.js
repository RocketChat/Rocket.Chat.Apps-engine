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
class MessageRead {
    constructor(messageBridge, appId) {
        this.messageBridge = messageBridge;
        this.appId = appId;
    }
    getById(id) {
        return this.messageBridge.getById(id, this.appId);
    }
    getSenderUser(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.messageBridge.getById(messageId, this.appId);
            if (!msg) {
                return undefined;
            }
            return msg.sender;
        });
    }
    getRoom(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.messageBridge.getById(messageId, this.appId);
            if (!msg) {
                return undefined;
            }
            return msg.room;
        });
    }
}
exports.MessageRead = MessageRead;

//# sourceMappingURL=MessageRead.js.map
