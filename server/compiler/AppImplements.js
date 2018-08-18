"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utilities_1 = require("../misc/Utilities");
var AppInterface;
(function (AppInterface) {
    // Messages
    AppInterface["IPreMessageSentPrevent"] = "IPreMessageSentPrevent";
    AppInterface["IPreMessageSentExtend"] = "IPreMessageSentExtend";
    AppInterface["IPreMessageSentModify"] = "IPreMessageSentModify";
    AppInterface["IPostMessageSent"] = "IPostMessageSent";
    AppInterface["IPreMessageDeletePrevent"] = "IPreMessageDeletePrevent";
    AppInterface["IPostMessageDeleted"] = "IPostMessageDeleted";
    // Rooms
    AppInterface["IPreRoomCreatePrevent"] = "IPreRoomCreatePrevent";
    AppInterface["IPreRoomCreateExtend"] = "IPreRoomCreateExtend";
    AppInterface["IPreRoomCreateModify"] = "IPreRoomCreateModify";
    AppInterface["IPostRoomCreate"] = "IPostRoomCreate";
    AppInterface["IPreRoomDeletePrevent"] = "IPreRoomDeletePrevent";
    AppInterface["IPostRoomDeleted"] = "IPostRoomDeleted";
})(AppInterface = exports.AppInterface || (exports.AppInterface = {}));
class AppImplements {
    constructor() {
        this.implemented = {};
        Object.keys(AppInterface).forEach((int) => this.implemented[int] = false);
    }
    doesImplement(int) {
        if (int in AppInterface) {
            this.implemented[int] = true;
        }
    }
    getValues() {
        return Utilities_1.Utilities.deepCloneAndFreeze(this.implemented);
    }
}
exports.AppImplements = AppImplements;

//# sourceMappingURL=AppImplements.js.map
