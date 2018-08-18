"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvironmentalVariableRead {
    constructor(bridge, appId) {
        this.bridge = bridge;
        this.appId = appId;
    }
    getValueByName(envVarName) {
        return this.bridge.getValueByName(envVarName, this.appId);
    }
    isReadable(envVarName) {
        return this.bridge.isReadable(envVarName, this.appId);
    }
    isSet(envVarName) {
        return this.bridge.isSet(envVarName, this.appId);
    }
}
exports.EnvironmentalVariableRead = EnvironmentalVariableRead;

//# sourceMappingURL=EnvironmentalVariableRead.js.map
