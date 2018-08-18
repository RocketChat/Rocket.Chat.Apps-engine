"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppFabricationFulfillment {
    constructor() {
        this.compilerErrors = new Array();
    }
    setAppInfo(information) {
        this.info = information;
    }
    getAppInfo() {
        return this.info;
    }
    setApp(application) {
        this.app = application;
    }
    getApp() {
        return this.app;
    }
    setImplementedInterfaces(interfaces) {
        this.implemented = interfaces;
    }
    getImplementedInferfaces() {
        return this.implemented;
    }
    setCompilerErrors(errors) {
        this.compilerErrors = errors;
    }
    getCompilerErrors() {
        return this.compilerErrors;
    }
}
exports.AppFabricationFulfillment = AppFabricationFulfillment;

//# sourceMappingURL=AppFabricationFulfillment.js.map
