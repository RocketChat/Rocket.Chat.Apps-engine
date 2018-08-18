"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RocketChatAssociationModel;
(function (RocketChatAssociationModel) {
    RocketChatAssociationModel["ROOM"] = "room";
    RocketChatAssociationModel["MESSAGE"] = "message";
    RocketChatAssociationModel["USER"] = "user";
    RocketChatAssociationModel["FILE"] = "file";
    RocketChatAssociationModel["MISC"] = "misc";
})(RocketChatAssociationModel = exports.RocketChatAssociationModel || (exports.RocketChatAssociationModel = {}));
class RocketChatAssociationRecord {
    constructor(model, id) {
        this.model = model;
        this.id = id;
    }
    getModel() {
        return this.model;
    }
    getID() {
        return this.id;
    }
}
exports.RocketChatAssociationRecord = RocketChatAssociationRecord;

//# sourceMappingURL=RocketChatAssociations.js.map
