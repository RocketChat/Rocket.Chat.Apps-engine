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
const bridges_1 = require("./bridges");
const compiler_1 = require("./compiler");
const managers_1 = require("./managers");
const DisabledApp_1 = require("./misc/DisabledApp");
const ProxiedApp_1 = require("./ProxiedApp");
const storage_1 = require("./storage");
const AppStatus_1 = require("../definition/AppStatus");
const metadata_1 = require("../definition/metadata");
class AppManager {
    constructor(rlStorage, logStorage, rlBridges) {
        // Singleton style. There can only ever be one AppManager instance
        if (typeof AppManager.Instance !== 'undefined') {
            throw new Error('There is already a valid AppManager instance.');
        }
        if (rlStorage instanceof storage_1.AppStorage) {
            this.storage = rlStorage;
        }
        else {
            throw new Error('Invalid instance of the AppStorage.');
        }
        if (logStorage instanceof storage_1.AppLogStorage) {
            this.logStorage = logStorage;
        }
        else {
            throw new Error('Invalid instance of the AppLogStorage.');
        }
        if (rlBridges instanceof bridges_1.AppBridges) {
            this.bridges = rlBridges;
        }
        else {
            throw new Error('Invalid instance of the AppBridges');
        }
        this.apps = new Map();
        this.parser = new compiler_1.AppPackageParser();
        this.compiler = new compiler_1.AppCompiler();
        this.accessorManager = new managers_1.AppAccessorManager(this);
        this.listenerManager = new managers_1.AppListenerManger(this);
        this.commandManager = new managers_1.AppSlashCommandManager(this);
        this.settingsManager = new managers_1.AppSettingsManager(this);
        this.isLoaded = false;
        AppManager.Instance = this;
    }
    /** Gets the instance of the storage connector. */
    getStorage() {
        return this.storage;
    }
    /** Gets the instance of the log storage connector. */
    getLogStorage() {
        return this.logStorage;
    }
    /** Gets the instance of the App package parser. */
    getParser() {
        return this.parser;
    }
    /** Gets the compiler instance. */
    getCompiler() {
        return this.compiler;
    }
    /** Gets the accessor manager instance. */
    getAccessorManager() {
        return this.accessorManager;
    }
    /** Gets the instance of the Bridge manager. */
    getBridges() {
        return this.bridges;
    }
    /** Gets the instance of the listener manager. */
    getListenerManager() {
        return this.listenerManager;
    }
    /** Gets the command manager's instance. */
    getCommandManager() {
        return this.commandManager;
    }
    /** Gets the manager of the settings, updates and getting. */
    getSettingsManager() {
        return this.settingsManager;
    }
    /** Gets whether the Apps have been loaded or not. */
    areAppsLoaded() {
        return this.isLoaded;
    }
    /**
     * Goes through the entire loading up process.
     * Expect this to take some time, as it goes through a very
     * long process of loading all the Apps up.
     */
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            // You can not load the AppManager system again
            // if it has already been loaded.
            if (this.isLoaded) {
                return;
            }
            const items = yield this.storage.retrieveAll();
            const affs = new Array();
            for (const item of items.values()) {
                const aff = new compiler_1.AppFabricationFulfillment();
                try {
                    const result = yield this.getParser().parseZip(this.getCompiler(), item.zip);
                    aff.setAppInfo(result.info);
                    aff.setImplementedInterfaces(result.implemented.getValues());
                    aff.setCompilerErrors(result.compilerErrors);
                    if (result.compilerErrors.length > 0) {
                        throw new Error(`Failed to compile due to ${result.compilerErrors.length} errors.`);
                    }
                    item.compiled = result.compiledFiles;
                    const app = this.getCompiler().toSandBox(this, item);
                    this.apps.set(item.id, app);
                    aff.setApp(app);
                }
                catch (e) {
                    console.warn(`Error while compiling the App "${item.info.name} (${item.id})":`);
                    console.error(e);
                    const app = DisabledApp_1.DisabledApp.createNew(item.info, AppStatus_1.AppStatus.COMPILER_ERROR_DISABLED);
                    app.getLogger().error(e);
                    this.logStorage.storeEntries(app.getID(), app.getLogger());
                    const prl = new ProxiedApp_1.ProxiedApp(this, item, app, () => '');
                    this.apps.set(item.id, prl);
                    aff.setApp(prl);
                }
                affs.push(aff);
            }
            // Let's initialize them
            for (const rl of this.apps.values()) {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    // Usually if an App is disabled before it's initialized,
                    // then something (such as an error) occured while
                    // it was compiled or something similar.
                    continue;
                }
                yield this.initializeApp(items.get(rl.getID()), rl, true);
            }
            // Let's ensure the required settings are all set
            for (const rl of this.apps.values()) {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    continue;
                }
                if (!this.areRequiredSettingsSet(rl.getStorageItem())) {
                    yield rl.setStatus(AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED);
                }
            }
            // Now let's enable the apps which were once enabled
            // but are not currently disabled.
            for (const rl of this.apps.values()) {
                if (!AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus()) && AppStatus_1.AppStatusUtils.isEnabled(rl.getPreviousStatus())) {
                    yield this.enableApp(items.get(rl.getID()), rl, true, rl.getPreviousStatus() === AppStatus_1.AppStatus.MANUALLY_ENABLED);
                }
            }
            this.isLoaded = true;
            return affs;
        });
    }
    unload(isManual) {
        return __awaiter(this, void 0, void 0, function* () {
            // If the AppManager hasn't been loaded yet, then
            // there is nothing to unload
            if (!this.isLoaded) {
                return;
            }
            for (const rl of this.apps.values()) {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    continue;
                }
                else if (rl.getStatus() === AppStatus_1.AppStatus.INITIALIZED) {
                    this.listenerManager.unregisterListeners(rl);
                    this.commandManager.unregisterCommands(rl.getID());
                    this.accessorManager.purifyApp(rl.getID());
                    continue;
                }
                yield this.disable(rl.getID(), isManual);
            }
            // Remove all the apps from the system now that we have unloaded everything
            this.apps.clear();
            this.isLoaded = false;
        });
    }
    /** Gets the Apps which match the filter passed in. */
    get(filter) {
        let rls = new Array();
        if (typeof filter === 'undefined') {
            this.apps.forEach((rl) => rls.push(rl));
            return rls;
        }
        let nothing = true;
        if (typeof filter.enabled === 'boolean' && filter.enabled) {
            this.apps.forEach((rl) => {
                if (AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }
        if (typeof filter.disabled === 'boolean' && filter.disabled) {
            this.apps.forEach((rl) => {
                if (AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }
        if (nothing) {
            this.apps.forEach((rl) => rls.push(rl));
        }
        if (typeof filter.ids !== 'undefined') {
            rls = rls.filter((rl) => filter.ids.includes(rl.getID()));
        }
        if (typeof filter.name === 'string') {
            rls = rls.filter((rl) => rl.getName() === filter.name);
        }
        else if (filter.name instanceof RegExp) {
            rls = rls.filter((rl) => filter.name.test(rl.getName()));
        }
        return rls;
    }
    /** Gets a single App by the id passed in. */
    getOneById(appId) {
        return this.apps.get(appId);
    }
    enable(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = this.apps.get(id);
            if (!rl) {
                throw new Error(`No App by the id "${id}" exists.`);
            }
            if (AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('The App is already enabled.');
            }
            if (rl.getStatus() === AppStatus_1.AppStatus.COMPILER_ERROR_DISABLED) {
                throw new Error('The App had compiler errors, can not enable it.');
            }
            const storageItem = yield this.storage.retrieveOne(id);
            if (!storageItem) {
                throw new Error(`Could not enable an App with the id of "${id}" as it doesn't exist.`);
            }
            const isSetup = yield this.runStartUpProcess(storageItem, rl, true, false);
            if (isSetup) {
                storageItem.status = rl.getStatus();
                // This is async, but we don't care since it only updates in the database
                // and it should not mutate any properties we care about
                this.storage.update(storageItem);
            }
            return isSetup;
        });
    }
    disable(id, isManual = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = this.apps.get(id);
            if (!rl) {
                throw new Error(`No App by the id "${id}" exists.`);
            }
            if (!AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error(`No App by the id of "${id}" is enabled."`);
            }
            const storageItem = yield this.storage.retrieveOne(id);
            if (!storageItem) {
                throw new Error(`Could not disable an App with the id of "${id}" as it doesn't exist.`);
            }
            try {
                yield rl.call(metadata_1.AppMethod.ONDISABLE, this.accessorManager.getConfigurationModify(storageItem.id));
            }
            catch (e) {
                console.warn('Error while disabling:', e);
            }
            this.listenerManager.unregisterListeners(rl);
            this.commandManager.unregisterCommands(storageItem.id);
            this.accessorManager.purifyApp(storageItem.id);
            if (isManual) {
                yield rl.setStatus(AppStatus_1.AppStatus.MANUALLY_DISABLED);
            }
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            storageItem.status = rl.getStatus();
            this.storage.update(storageItem);
            return true;
        });
    }
    add(zipContentsBase64d, enable = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const aff = new compiler_1.AppFabricationFulfillment();
            const result = yield this.getParser().parseZip(this.getCompiler(), zipContentsBase64d);
            aff.setAppInfo(result.info);
            aff.setImplementedInterfaces(result.implemented.getValues());
            aff.setCompilerErrors(result.compilerErrors);
            if (result.compilerErrors.length > 0) {
                return aff;
            }
            const created = yield this.storage.create({
                id: result.info.id,
                info: result.info,
                status: AppStatus_1.AppStatus.UNKNOWN,
                zip: zipContentsBase64d,
                compiled: result.compiledFiles,
                languageContent: result.languageContent,
                settings: {},
                implemented: result.implemented.getValues(),
            });
            if (!created) {
                throw new Error('Failed to create the App, the storage did not return it.');
            }
            // Now that is has all been compiled, let's get the
            // the App instance from the source.
            const app = this.getCompiler().toSandBox(this, created);
            this.apps.set(app.getID(), app);
            aff.setApp(app);
            // Let everyone know that the App has been added
            try {
                yield this.bridges.getAppActivationBridge().appAdded(app);
            }
            catch (e) {
                // If an error occurs during this, oh well.
            }
            // Should enable === true, then we go through the entire start up process
            // Otherwise, we only initialize it.
            if (enable) {
                // Start up the app
                yield this.runStartUpProcess(created, app, false, false);
            }
            else {
                yield this.initializeApp(created, app, true);
            }
            return aff;
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.apps.get(id);
            if (AppStatus_1.AppStatusUtils.isEnabled(app.getStatus())) {
                yield this.disable(id);
            }
            this.listenerManager.unregisterListeners(app);
            this.commandManager.unregisterCommands(app.getID());
            this.accessorManager.purifyApp(app.getID());
            yield this.bridges.getPersistenceBridge().purge(app.getID());
            yield this.logStorage.removeEntriesFor(app.getID());
            yield this.storage.remove(app.getID());
            // Let everyone know that the App has been removed
            try {
                yield this.bridges.getAppActivationBridge().appRemoved(app);
            }
            catch (e) {
                // If an error occurs during this, oh well.
            }
            this.apps.delete(app.getID());
            return app;
        });
    }
    update(zipContentsBase64d) {
        return __awaiter(this, void 0, void 0, function* () {
            const aff = new compiler_1.AppFabricationFulfillment();
            const result = yield this.getParser().parseZip(this.getCompiler(), zipContentsBase64d);
            aff.setAppInfo(result.info);
            aff.setImplementedInterfaces(result.implemented.getValues());
            aff.setCompilerErrors(result.compilerErrors);
            if (result.compilerErrors.length > 0) {
                return aff;
            }
            const old = yield this.storage.retrieveOne(result.info.id);
            if (!old) {
                throw new Error('Can not update an App that does not currently exist.');
            }
            // Attempt to disable it, if it wasn't enabled then it will error and we don't care
            try {
                yield this.disable(old.id);
            }
            catch (e) {
                // We don't care
            }
            // TODO: We could show what new interfaces have been added
            const stored = yield this.storage.update({
                createdAt: old.createdAt,
                id: result.info.id,
                info: result.info,
                status: this.apps.get(old.id).getStatus(),
                zip: zipContentsBase64d,
                compiled: result.compiledFiles,
                languageContent: result.languageContent,
                settings: old.settings,
                implemented: result.implemented.getValues(),
            });
            // Now that is has all been compiled, let's get the
            // the App instance from the source.
            const app = this.getCompiler().toSandBox(this, stored);
            // Store it temporarily so we can access it else where
            this.apps.set(app.getID(), app);
            aff.setApp(app);
            // Start up the app
            yield this.runStartUpProcess(stored, app, false, true);
            // Let everyone know that the App has been updated
            try {
                yield this.bridges.getAppActivationBridge().appUpdated(app);
            }
            catch (e) {
                // If an error occurs during this, oh well.
            }
            return aff;
        });
    }
    getLanguageContent() {
        const langs = {};
        this.apps.forEach((rl) => {
            const content = rl.getStorageItem().languageContent;
            Object.keys(content).forEach((key) => {
                langs[key] = Object.assign(langs[key] || {}, content[key]);
            });
        });
        return langs;
    }
    changeStatus(appId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (status) {
                case AppStatus_1.AppStatus.MANUALLY_DISABLED:
                case AppStatus_1.AppStatus.MANUALLY_ENABLED:
                    break;
                default:
                    throw new Error('Invalid status to change an App to, must be manually disabled or enabled.');
            }
            const rl = this.apps.get(appId);
            if (!rl) {
                throw new Error('Can not change the status of an App which does not currently exist.');
            }
            if (AppStatus_1.AppStatusUtils.isEnabled(status)) {
                // Then enable it
                if (AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                    throw new Error('Can not enable an App which is already enabled.');
                }
                yield this.enable(rl.getID());
            }
            else {
                if (!AppStatus_1.AppStatusUtils.isEnabled(rl.getStatus())) {
                    throw new Error('Can not disable an App which is not enabled.');
                }
                yield this.disable(rl.getID(), true);
            }
            return rl;
        });
    }
    /**
     * Goes through the entire loading up process. WARNING: Do not use. ;)
     *
     * @param appId the id of the application to load
     */
    loadOne(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.storage.retrieveOne(appId);
            if (!item) {
                throw new Error(`No App found by the id of: "${appId}"`);
            }
            this.apps.set(item.id, this.getCompiler().toSandBox(this, item));
            const rl = this.apps.get(item.id);
            yield this.initializeApp(item, rl, false);
            if (!this.areRequiredSettingsSet(item)) {
                yield rl.setStatus(AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED);
            }
            if (!AppStatus_1.AppStatusUtils.isDisabled(rl.getStatus()) && AppStatus_1.AppStatusUtils.isEnabled(rl.getPreviousStatus())) {
                yield this.enableApp(item, rl, false, rl.getPreviousStatus() === AppStatus_1.AppStatus.MANUALLY_ENABLED);
            }
            return this.apps.get(item.id);
        });
    }
    runStartUpProcess(storageItem, app, isManual, silenceStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (app.getStatus() !== AppStatus_1.AppStatus.INITIALIZED) {
                const isInitialized = yield this.initializeApp(storageItem, app, true, silenceStatus);
                if (!isInitialized) {
                    return false;
                }
            }
            if (!this.areRequiredSettingsSet(storageItem)) {
                yield app.setStatus(AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED, silenceStatus);
                return false;
            }
            const isEnabled = yield this.enableApp(storageItem, app, true, isManual, silenceStatus);
            if (!isEnabled) {
                return false;
            }
            return true;
        });
    }
    initializeApp(storageItem, app, saveToDb = true, silenceStatus = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            const configExtend = this.getAccessorManager().getConfigurationExtend(storageItem.id);
            const envRead = this.getAccessorManager().getEnvironmentRead(storageItem.id);
            try {
                yield app.call(metadata_1.AppMethod.INITIALIZE, configExtend, envRead);
                result = true;
                yield app.setStatus(AppStatus_1.AppStatus.INITIALIZED, silenceStatus);
            }
            catch (e) {
                if (e.name === 'NotEnoughMethodArgumentsError') {
                    console.warn('Please report the following error:');
                }
                console.error(e);
                this.commandManager.unregisterCommands(storageItem.id);
                result = false;
                yield app.setStatus(AppStatus_1.AppStatus.ERROR_DISABLED, silenceStatus);
            }
            if (saveToDb) {
                // This is async, but we don't care since it only updates in the database
                // and it should not mutate any properties we care about
                storageItem.status = app.getStatus();
                this.storage.update(storageItem);
            }
            return result;
        });
    }
    /**
     * Determines if the App's required settings are set or not.
     * Should a packageValue be provided and not empty, then it's considered set.
     */
    areRequiredSettingsSet(storageItem) {
        let result = true;
        for (const setk of Object.keys(storageItem.settings)) {
            const sett = storageItem.settings[setk];
            // If it's not required, ignore
            if (!sett.required) {
                continue;
            }
            if (sett.value !== 'undefined' || sett.packageValue !== 'undefined') {
                continue;
            }
            result = false;
        }
        return result;
    }
    enableApp(storageItem, app, saveToDb = true, isManual, silenceStatus = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let enable;
            try {
                enable = (yield app.call(metadata_1.AppMethod.ONENABLE, this.getAccessorManager().getEnvironmentRead(storageItem.id), this.getAccessorManager().getConfigurationModify(storageItem.id)));
                yield app.setStatus(isManual ? AppStatus_1.AppStatus.MANUALLY_ENABLED : AppStatus_1.AppStatus.AUTO_ENABLED, silenceStatus);
            }
            catch (e) {
                enable = false;
                if (e.name === 'NotEnoughMethodArgumentsError') {
                    console.warn('Please report the following error:');
                }
                console.error(e);
                yield app.setStatus(AppStatus_1.AppStatus.ERROR_DISABLED, silenceStatus);
            }
            if (enable) {
                this.commandManager.registerCommands(app.getID());
                this.listenerManager.registerListeners(app);
            }
            else {
                this.commandManager.unregisterCommands(app.getID());
            }
            if (saveToDb) {
                storageItem.status = app.getStatus();
                // This is async, but we don't care since it only updates in the database
                // and it should not mutate any properties we care about
                this.storage.update(storageItem);
            }
            return enable;
        });
    }
}
exports.AppManager = AppManager;

//# sourceMappingURL=AppManager.js.map
