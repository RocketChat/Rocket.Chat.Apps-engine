"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserRead {
    constructor(userBridge, appId) {
        this.userBridge = userBridge;
        this.appId = appId;
    }
    getById(id) {
        return this.userBridge.getById(id, this.appId);
    }
    getByUsername(username) {
        return this.userBridge.getByUsername(username, this.appId);
    }
}
exports.UserRead = UserRead;

//# sourceMappingURL=UserRead.js.map
