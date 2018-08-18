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
const MessageExtender_1 = require("./MessageExtender");
const RoomExtender_1 = require("./RoomExtender");
class ModifyExtender {
    constructor(bridges, appId) {
        this.bridges = bridges;
        this.appId = appId;
    }
    extendMessage(messageId, updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.bridges.getMessageBridge().getById(messageId, this.appId);
            msg.editor = updater;
            msg.editedAt = new Date();
            return new MessageExtender_1.MessageExtender(msg);
        });
    }
    extendRoom(roomId, updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.bridges.getRoomBridge().getById(roomId, this.appId);
            room.updatedAt = new Date();
            return new RoomExtender_1.RoomExtender(room);
        });
    }
    finish(extender) {
        switch (extender.kind) {
            case metadata_1.RocketChatAssociationModel.MESSAGE:
                return this.bridges.getMessageBridge().update(extender.getMessage(), this.appId);
            case metadata_1.RocketChatAssociationModel.ROOM:
                return this.bridges.getRoomBridge().update(extender.getRoom(), this.appId);
            default:
                throw new Error('Invalid extender passed to the ModifyExtender.finish function.');
        }
    }
}
exports.ModifyExtender = ModifyExtender;

//# sourceMappingURL=ModifyExtender.js.map
