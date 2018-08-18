"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomRead {
    constructor(roomBridge, appId) {
        this.roomBridge = roomBridge;
        this.appId = appId;
    }
    getById(id) {
        return this.roomBridge.getById(id, this.appId);
    }
    getCreatorUserById(id) {
        return this.roomBridge.getCreatorById(id, this.appId);
    }
    getByName(name) {
        return this.roomBridge.getByName(name, this.appId);
    }
    getCreatorUserByName(name) {
        return this.roomBridge.getCreatorByName(name, this.appId);
    }
    getMessages(roomId) {
        throw new Error('Method not implemented.');
    }
    getMembers(roomId) {
        throw new Error('Method not implemented.');
    }
}
exports.RoomRead = RoomRead;

//# sourceMappingURL=RoomRead.js.map
