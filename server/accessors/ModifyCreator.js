"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../../definition/metadata");
const MessageBuilder_1 = require("./MessageBuilder");
const RoomBuilder_1 = require("./RoomBuilder");
class ModifyCreator {
    constructor(bridges, appId) {
        this.bridges = bridges;
        this.appId = appId;
    }
    startMessage(data) {
        if (data) {
            delete data.id;
        }
        return new MessageBuilder_1.MessageBuilder(data);
    }
    startRoom(data) {
        if (data) {
            delete data.id;
        }
        return new RoomBuilder_1.RoomBuilder(data);
    }
    finish(builder) {
        switch (builder.kind) {
            case metadata_1.RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case metadata_1.RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyCreator.finish function.');
        }
    }
    _finishMessage(builder) {
        const result = builder.getMessage();
        delete result.id;
        if (!result.sender || !result.sender.id) {
            throw new Error('Invalid sender assigned to the message.');
        }
        return this.bridges.getMessageBridge().create(result, this.appId);
    }
    _finishRoom(builder) {
        const result = builder.getRoom();
        delete result.id;
        if (!result.creator || !result.creator.id) {
            throw new Error('Invalid creator assigned to the room.');
        }
        if (!result.slugifiedName || !result.slugifiedName.trim()) {
            throw new Error('Invalid slugifiedName assigned to the room.');
        }
        if (!result.displayName || !result.displayName.trim()) {
            throw new Error('Invalid displayName assigned to the room.');
        }
        if (!result.type) {
            throw new Error('Invalid type assigned to the room.');
        }
        return this.bridges.getRoomBridge().create(result, this.appId);
    }
}
exports.ModifyCreator = ModifyCreator;

//# sourceMappingURL=ModifyCreator.js.map
