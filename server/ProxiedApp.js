"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../definition/metadata");
const errors_1 = require("./errors");
const vm = require("vm");
const index_1 = require("./logging/index");
class ProxiedApp {
    constructor(manager, storageItem, app, customRequire) {
        this.manager = manager;
        this.storageItem = storageItem;
        this.app = app;
        this.customRequire = customRequire;
        this.previousStatus = storageItem.status;
    }
    getApp() {
        return this.app;
    }
    getStorageItem() {
        return this.storageItem;
    }
    setStorageItem(item) {
        this.storageItem = item;
    }
    getPreviousStatus() {
        return this.previousStatus;
    }
    getImplementationList() {
        return this.storageItem.implemented;
    }
    hasMethod(method) {
        console.log('Checking:', method);
        return typeof this.app[method] === 'function';
    }
    makeContext(data) {
        return vm.createContext(Object.assign({}, {
            require: this.customRequire,
            console: this.app.getLogger(),
        }, data));
    }
    setupLogger(method) {
        const logger = new index_1.AppConsole(method);
        // Set the logger to our new one
        this.app.logger = logger;
        return logger;
    }
    runInContext(codeToRun, context) {
        return vm.runInContext(codeToRun, context, { timeout: 1000 });
    }
    call(method, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.app[method] !== 'function') {
                throw new Error(`The App ${this.app.getName()} (${this.app.getID()}`
                    + ` does not have the method: "${method}"`);
            }
            // tslint:disable-next-line
            const methodDeclartion = this.app[method];
            if (args.length < methodDeclartion.length) {
                throw new errors_1.NotEnoughMethodArgumentsError(method, methodDeclartion.length, args.length);
            }
            const logger = this.setupLogger(method);
            logger.debug(`${method} is being called...`);
            let result;
            try {
                // tslint:disable-next-line:max-line-length
                result = (yield this.runInContext(`Promise.resolve(args).then((args) => app.${method}.apply(app, args))`, this.makeContext({ app: this.app, args })));
                logger.debug(`'${method}' was successfully called! The result is:`, result);
            }
            catch (e) {
                logger.error(e);
                logger.debug(`'${method}' was unsuccessful.`);
            }
            this.manager.getLogStorage().storeEntries(this.getID(), logger);
            return result;
        });
    }
    getStatus() {
        return this.app.getStatus();
    }
    setStatus(status, silent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.call(metadata_1.AppMethod.SETSTATUS, status);
            if (!silent) {
                yield this.manager.getBridges().getAppActivationBridge().appStatusChanged(this, status);
            }
        });
    }
    getName() {
        return this.app.getName();
    }
    getNameSlug() {
        return this.app.getNameSlug();
    }
    getID() {
        return this.app.getID();
    }
    getVersion() {
        return this.app.getVersion();
    }
    getDescription() {
        return this.app.getDescription();
    }
    getRequiredApiVersion() {
        return this.app.getRequiredApiVersion();
    }
    getAuthorInfo() {
        return this.app.getAuthorInfo();
    }
    getInfo() {
        return this.app.getInfo();
    }
    getLogger() {
        return this.app.getLogger();
    }
}
exports.ProxiedApp = ProxiedApp;

//# sourceMappingURL=ProxiedApp.js.map
