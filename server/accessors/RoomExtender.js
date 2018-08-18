"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../../definition/metadata");
const Utilities_1 = require("../misc/Utilities");
class RoomExtender {
    constructor(room) {
        this.room = room;
        this.kind = metadata_1.RocketChatAssociationModel.ROOM;
    }
    addCustomField(key, value) {
        if (!this.room.customFields) {
            this.room.customFields = {};
        }
        if (this.room.customFields[key]) {
            throw new Error(`The room already contains a custom field by the key: ${key}`);
        }
        this.room.customFields[key] = value;
        return this;
    }
    addMember(user) {
        if (!Array.isArray(this.room.usernames)) {
            this.room.usernames = new Array();
        }
        if (this.room.usernames.includes(user.username)) {
            throw new Error('The user is already in the room.');
        }
        this.room.usernames.push(user.username);
        return this;
    }
    getRoom() {
        return Utilities_1.Utilities.deepClone(this.room);
    }
}
exports.RoomExtender = RoomExtender;

//# sourceMappingURL=RoomExtender.js.map
