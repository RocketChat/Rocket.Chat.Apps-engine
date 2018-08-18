"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PersistenceRead {
    constructor(persistBridge, appId) {
        this.persistBridge = persistBridge;
        this.appId = appId;
    }
    read(id) {
        return this.persistBridge.readById(id, this.appId);
    }
    readByAssociation(association) {
        return this.persistBridge.readByAssociations(new Array(association), this.appId);
    }
    readByAssociations(associations) {
        return this.persistBridge.readByAssociations(associations, this.appId);
    }
}
exports.PersistenceRead = PersistenceRead;

//# sourceMappingURL=PersistenceRead.js.map
