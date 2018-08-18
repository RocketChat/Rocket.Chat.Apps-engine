"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Persistence {
    constructor(persistBridge, appId) {
        this.persistBridge = persistBridge;
        this.appId = appId;
    }
    create(data) {
        return this.persistBridge.create(data, this.appId);
    }
    createWithAssociation(data, association) {
        return this.persistBridge.createWithAssociations(data, new Array(association), this.appId);
    }
    createWithAssociations(data, associations) {
        return this.persistBridge.createWithAssociations(data, associations, this.appId);
    }
    update(id, data, upsert = false) {
        return this.persistBridge.update(id, data, upsert, this.appId);
    }
    remove(id) {
        return this.persistBridge.remove(id, this.appId);
    }
    removeByAssociation(association) {
        return this.persistBridge.removeByAssociations(new Array(association), this.appId);
    }
    removeByAssociations(associations) {
        return this.persistBridge.removeByAssociations(associations, this.appId);
    }
}
exports.Persistence = Persistence;

//# sourceMappingURL=Persistence.js.map
