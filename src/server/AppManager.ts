import { AppBridges } from './bridges';
import { AppCompiler, AppFabricationFulfillment, AppPackageParser } from './compiler';
import { IGetAppsFilter } from './IGetAppsFilter';
import {
    AppAccessorManager,
    AppApiManager,
    AppExternalComponentManager,
    AppLicenseManager,
    AppListenerManager,
    AppSchedulerManager,
    AppSettingsManager,
    AppSlashCommandManager,
} from './managers';
import { DisabledApp } from './misc/DisabledApp';
import { ProxiedApp } from './ProxiedApp';
import { AppLogStorage, AppStorage, IAppStorageItem } from './storage';

import { AppStatus, AppStatusUtils } from '../definition/AppStatus';
import { AppMethod } from '../definition/metadata';
import { IUser, UserType } from '../definition/users';
import { InvalidLicenseError } from './errors';
import { IMarketplaceInfo } from './marketplace';

export class AppManager {
    public static Instance: AppManager;

    // apps contains all of the Apps
    private readonly apps: Map<string, ProxiedApp>;
    private readonly storage: AppStorage;
    private readonly logStorage: AppLogStorage;
    private readonly bridges: AppBridges;
    private readonly parser: AppPackageParser;
    private readonly compiler: AppCompiler;

    private readonly accessorManager: AppAccessorManager;
    private readonly listenerManager: AppListenerManager;
    private readonly commandManager: AppSlashCommandManager;
    private readonly apiManager: AppApiManager;
    private readonly externalComponentManager: AppExternalComponentManager;
    private readonly settingsManager: AppSettingsManager;
    private readonly licenseManager: AppLicenseManager;
    private readonly schedulerManager: AppSchedulerManager;

    private isLoaded: boolean;

    constructor(rlStorage: AppStorage, logStorage: AppLogStorage, rlBridges: AppBridges) {
        // Singleton style. There can only ever be one AppManager instance
        if (typeof AppManager.Instance !== 'undefined') {
            throw new Error('There is already a valid AppManager instance.');
        }

        if (rlStorage instanceof AppStorage) {
            this.storage = rlStorage;
        } else {
            throw new Error('Invalid instance of the AppStorage.');
        }

        if (logStorage instanceof AppLogStorage) {
            this.logStorage = logStorage;
        } else {
            throw new Error('Invalid instance of the AppLogStorage.');
        }

        if (rlBridges instanceof AppBridges) {
            this.bridges = rlBridges;
        } else {
            throw new Error('Invalid instance of the AppBridges');
        }

        this.apps = new Map<string, ProxiedApp>();

        this.parser = new AppPackageParser();
        this.compiler = new AppCompiler();
        this.accessorManager = new AppAccessorManager(this);
        this.listenerManager = new AppListenerManager(this);
        this.commandManager = new AppSlashCommandManager(this);
        this.apiManager = new AppApiManager(this);
        this.externalComponentManager = new AppExternalComponentManager();
        this.settingsManager = new AppSettingsManager(this);
        this.licenseManager = new AppLicenseManager(this);
        this.schedulerManager = new AppSchedulerManager(this);

        this.isLoaded = false;
        AppManager.Instance = this;
    }

    /** Gets the instance of the storage connector. */
    public getStorage(): AppStorage {
        return this.storage;
    }

    /** Gets the instance of the log storage connector. */
    public getLogStorage(): AppLogStorage {
        return this.logStorage;
    }

    /** Gets the instance of the App package parser. */
    public getParser(): AppPackageParser {
        return this.parser;
    }

    /** Gets the compiler instance. */
    public getCompiler(): AppCompiler {
        return this.compiler;
    }

    /** Gets the accessor manager instance. */
    public getAccessorManager(): AppAccessorManager {
        return this.accessorManager;
    }

    /** Gets the instance of the Bridge manager. */
    public getBridges(): AppBridges {
        return this.bridges;
    }

    /** Gets the instance of the listener manager. */
    public getListenerManager(): AppListenerManager {
        return this.listenerManager;
    }

    /** Gets the command manager's instance. */
    public getCommandManager(): AppSlashCommandManager {
        return this.commandManager;
    }

    public getLicenseManager(): AppLicenseManager {
        return this.licenseManager;
    }

    /** Gets the api manager's instance. */
    public getApiManager(): AppApiManager {
        return this.apiManager;
    }

    /** Gets the external component manager's instance. */
    public getExternalComponentManager(): AppExternalComponentManager {
        return this.externalComponentManager;
    }

    /** Gets the manager of the settings, updates and getting. */
    public getSettingsManager(): AppSettingsManager {
        return this.settingsManager;
    }

    public getSchedulerManager(): AppSchedulerManager {
        return this.schedulerManager;
    }

    /** Gets whether the Apps have been loaded or not. */
    public areAppsLoaded(): boolean {
        return this.isLoaded;
    }

    /**
     * Goes through the entire loading up process.
     * Expect this to take some time, as it goes through a very
     * long process of loading all the Apps up.
     */
    public async load(): Promise<Array<AppFabricationFulfillment>> {
        // You can not load the AppManager system again
        // if it has already been loaded.
        if (this.isLoaded) {
            return;
        }

        const items: Map<string, IAppStorageItem> = await this.storage.retrieveAll();
        const affs: Array<AppFabricationFulfillment> = new Array<AppFabricationFulfillment>();

        for (const item of items.values()) {
            const aff = new AppFabricationFulfillment();

            try {
                aff.setAppInfo(item.info);
                aff.setImplementedInterfaces(item.implemented);

                const app = this.getCompiler().toSandBox(this, item);
                this.apps.set(item.id, app);
                aff.setApp(app);
            } catch (e) {
                console.warn(`Error while compiling the App "${ item.info.name } (${ item.id })":`);
                console.error(e);

                const app = DisabledApp.createNew(item.info, AppStatus.COMPILER_ERROR_DISABLED);
                app.getLogger().error(e);
                this.logStorage.storeEntries(app.getID(), app.getLogger());

                const prl = new ProxiedApp(this, item, app, () => '');
                this.apps.set(item.id, prl);
                aff.setApp(prl);
            }

            affs.push(aff);
        }

        // Let's initialize them
        for (const rl of this.apps.values()) {
            if (AppStatusUtils.isDisabled(rl.getStatus())) {
                // Usually if an App is disabled before it's initialized,
                // then something (such as an error) occured while
                // it was compiled or something similar.
                continue;
            }

            await this.initializeApp(items.get(rl.getID()), rl, true).catch(console.error);
        }

        // Let's ensure the required settings are all set
        for (const rl of this.apps.values()) {
            if (AppStatusUtils.isDisabled(rl.getStatus())) {
                continue;
            }

            if (!this.areRequiredSettingsSet(rl.getStorageItem())) {
                await rl.setStatus(AppStatus.INVALID_SETTINGS_DISABLED).catch(console.error);
            }
        }

        // Now let's enable the apps which were once enabled
        // but are not currently disabled.
        for (const app of this.apps.values()) {
            if (!AppStatusUtils.isDisabled(app.getStatus()) && AppStatusUtils.isEnabled(app.getPreviousStatus())) {
                await this.enableApp(items.get(app.getID()), app, true, app.getPreviousStatus() === AppStatus.MANUALLY_ENABLED).catch(console.error);
            } else if (!AppStatusUtils.isError(app.getStatus())) {
                this.listenerManager.lockEssentialEvents(app);
            }
        }

        this.isLoaded = true;
        return affs;
    }

    public async unload(isManual: boolean): Promise<void> {
        // If the AppManager hasn't been loaded yet, then
        // there is nothing to unload
        if (!this.isLoaded) {
            return;
        }

        for (const app of this.apps.values()) {
            if (app.getStatus() === AppStatus.INITIALIZED) {
                this.listenerManager.unregisterListeners(app);
                this.commandManager.unregisterCommands(app.getID());
                this.externalComponentManager.unregisterExternalComponents(app.getID());
                this.apiManager.unregisterApis(app.getID());
                this.accessorManager.purifyApp(app.getID());
                await this.schedulerManager.cancelAllJobs(app.getID());
            } else if (!AppStatusUtils.isDisabled(app.getStatus())) {
                await this.disable(app.getID(), isManual ? AppStatus.MANUALLY_DISABLED : AppStatus.DISABLED);
            }

            this.listenerManager.releaseEssentialEvents(app);
        }

        // Remove all the apps from the system now that we have unloaded everything
        this.apps.clear();

        this.isLoaded = false;
    }

    /** Gets the Apps which match the filter passed in. */
    public get(filter?: IGetAppsFilter): Array<ProxiedApp> {
        let rls = new Array<ProxiedApp>();

        if (typeof filter === 'undefined') {
            this.apps.forEach((rl) => rls.push(rl));

            return rls;
        }

        let nothing = true;

        if (typeof filter.enabled === 'boolean' && filter.enabled) {
            this.apps.forEach((rl) => {
                if (AppStatusUtils.isEnabled(rl.getStatus())) {
                    rls.push(rl);
                }
            });
            nothing = false;
        }

        if (typeof filter.disabled === 'boolean' && filter.disabled) {
            this.apps.forEach((rl) => {
                if (AppStatusUtils.isDisabled(rl.getStatus())) {
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
        } else if (filter.name instanceof RegExp) {
            rls = rls.filter((rl) => (filter.name as RegExp).test(rl.getName()));
        }

        return rls;
    }

    /** Gets a single App by the id passed in. */
    public getOneById(appId: string): ProxiedApp {
        return this.apps.get(appId);
    }

    public async enable(id: string): Promise<boolean> {
        const rl = this.apps.get(id);

        if (!rl) {
            throw new Error(`No App by the id "${id}" exists.`);
        }

        if (AppStatusUtils.isEnabled(rl.getStatus())) {
            return true;
        }

        if (rl.getStatus() === AppStatus.COMPILER_ERROR_DISABLED) {
            throw new Error('The App had compiler errors, can not enable it.');
        }

        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not enable an App with the id of "${id}" as it doesn't exist.`);
        }

        const isSetup = await this.runStartUpProcess(storageItem, rl, true, false);
        if (isSetup) {
            storageItem.status = rl.getStatus();
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            await this.storage.update(storageItem).catch();
        }

        return isSetup;
    }

    public async disable(id: string, status: AppStatus = AppStatus.DISABLED, silent?: boolean): Promise<boolean> {
        if (!AppStatusUtils.isDisabled(status)) {
            throw new Error('Invalid disabled status');
        }

        const app = this.apps.get(id);

        if (!app) {
            throw new Error(`No App by the id "${id}" exists.`);
        }

        if (AppStatusUtils.isEnabled(app.getStatus())) {
            await app.call(AppMethod.ONDISABLE, this.accessorManager.getConfigurationModify(app.getID()))
                .catch((e) => console.warn('Error while disabling:', e));
        }

        this.listenerManager.unregisterListeners(app);
        this.listenerManager.lockEssentialEvents(app);
        this.commandManager.unregisterCommands(app.getID());
        this.externalComponentManager.unregisterExternalComponents(app.getID());
        this.apiManager.unregisterApis(app.getID());
        this.accessorManager.purifyApp(app.getID());
        await this.schedulerManager.cancelAllJobs(app.getID());

        await app.setStatus(status, silent);

        const storageItem = await this.storage.retrieveOne(id);

        app.getStorageItem().marketplaceInfo = storageItem.marketplaceInfo;
        await app.validateLicense().catch();

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = app.getStatus();
        await this.storage.update(storageItem).catch();

        return true;
    }

    public async add(appPackage: Buffer, enable = true, marketplaceInfo?: IMarketplaceInfo): Promise<AppFabricationFulfillment> {
        const aff = new AppFabricationFulfillment();
        const result = await this.getParser().unpackageApp(appPackage);

        aff.setAppInfo(result.info);
        aff.setImplementedInterfaces(result.implemented.getValues());

        const compiled = {
            id: result.info.id,
            info: result.info,
            status: AppStatus.UNKNOWN,
            zip: appPackage.toString('base64'),
            // tslint:disable-next-line: max-line-length
            compiled: Object.entries(result.files).reduce(
                (files, [key, value]) => (files[key.replace(/\./gi, '$')] = value, files),
                {} as {[key: string]: string},
            ),
            languageContent: result.languageContent,
            settings: {},
            implemented: result.implemented.getValues(),
            marketplaceInfo,
        };

        // Now that is has all been compiled, let's get the
        // the App instance from the source.
        const app = this.getCompiler().toSandBox(this, compiled);

        // Create a user for the app
        try {
            await this.createAppUser(app);
        } catch (err) {
            aff.setAppUserError({
                username: app.getAppUserUsername(),
                message: 'Failed to create an app user for this app.',
            });

            return aff;
        }

        const created = await this.storage.create(compiled);

        if (!created) {
            aff.setStorageError('Failed to create the App, the storage did not return it.');

            await this.removeAppUser(app);

            return aff;
        }

        this.apps.set(app.getID(), app);
        aff.setApp(app);

        // Let everyone know that the App has been added
        await this.bridges.getAppActivationBridge().appAdded(app).catch(() => {
            // If an error occurs during this, oh well.
        });

        // Should enable === true, then we go through the entire start up process
        // Otherwise, we only initialize it.
        if (enable) {
            // Start up the app
            await this.runStartUpProcess(created, app, false, false);
        } else {
            await this.initializeApp(created, app, true);
        }

        return aff;
    }
    public async remove(id: string): Promise<ProxiedApp> {
        const app = this.apps.get(id);

        // Let everyone know that the App has been removed
        await this.bridges.getAppActivationBridge().appRemoved(app).catch();

        if (AppStatusUtils.isEnabled(app.getStatus())) {
            await this.disable(id);
        }

        this.listenerManager.unregisterListeners(app);
        this.listenerManager.releaseEssentialEvents(app);
        this.commandManager.unregisterCommands(app.getID());
        this.externalComponentManager.purgeExternalComponents(app.getID());
        this.apiManager.unregisterApis(app.getID());
        this.accessorManager.purifyApp(app.getID());
        await this.removeAppUser(app);
        await this.bridges.getPersistenceBridge().purge(app.getID());
        await this.storage.remove(app.getID());
        await this.schedulerManager.cancelAllJobs(app.getID());

        // Let everyone know that the App has been removed
        await this.bridges.getAppActivationBridge().appRemoved(app);

        this.apps.delete(app.getID());

        return app;
    }

    public async update(appPackage: Buffer): Promise<AppFabricationFulfillment> {
        const aff = new AppFabricationFulfillment();
        const result = await this.getParser().unpackageApp(appPackage);

        aff.setAppInfo(result.info);
        aff.setImplementedInterfaces(result.implemented.getValues());

        const old = await this.storage.retrieveOne(result.info.id);

        if (!old) {
            throw new Error('Can not update an App that does not currently exist.');
        }

        await this.disable(old.id).catch();

        // TODO: We could show what new interfaces have been added

        const stored = await this.storage.update({
            createdAt: old.createdAt,
            id: result.info.id,
            info: result.info,
            status: this.apps.get(old.id).getStatus(),
            zip: appPackage.toString('base64'),
            compiled: Object.entries(result.files).reduce(
                (files, [key, value]) => (files[key.replace(/\./gi, '$')] = value, files),
                {} as {[key: string]: string},
            ),
            languageContent: result.languageContent,
            settings: old.settings,
            implemented: result.implemented.getValues(),
            marketplaceInfo: old.marketplaceInfo,
        });

        // Now that is has all been compiled, let's get the
        // the App instance from the source.
        const app = this.getCompiler().toSandBox(this, stored);

        // Ensure there is an user for the app
        try {
            await this.ensureAppUser(app);
        } catch (err) {
            aff.setAppUserError({
                username: app.getAppUserUsername(),
                message: 'Failed to create an app user for this app.',
            });

            return aff;
        }

        // Let everyone know that the App has been updated
        await this.bridges.getAppActivationBridge().appUpdated(app).catch();

        // Store it temporarily so we can access it else where
        this.apps.set(app.getID(), app);
        aff.setApp(app);

        // Start up the app
        await this.runStartUpProcess(stored, app, false, true);

        return aff;
    }

    public getLanguageContent(): { [key: string]: object } {
        const langs: { [key: string]: object } = { };

        this.apps.forEach((rl) => {
            const content = rl.getStorageItem().languageContent;

            Object.keys(content).forEach((key) => {
                langs[key] = Object.assign(langs[key] || {}, content[key]);
            });
        });

        return langs;
    }

    public async changeStatus(appId: string, status: AppStatus): Promise<ProxiedApp> {
        switch (status) {
            case AppStatus.MANUALLY_DISABLED:
            case AppStatus.MANUALLY_ENABLED:
                break;
            default:
                throw new Error('Invalid status to change an App to, must be manually disabled or enabled.');
        }

        const rl = this.apps.get(appId);

        if (!rl) {
            throw new Error('Can not change the status of an App which does not currently exist.');
        }

        if (AppStatusUtils.isEnabled(status)) {
            // Then enable it
            if (AppStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('Can not enable an App which is already enabled.');
            }

            await this.enable(rl.getID());
        } else {
            if (!AppStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('Can not disable an App which is not enabled.');
            }

            await this.disable(rl.getID(), AppStatus.MANUALLY_DISABLED);
        }

        return rl;
    }

    public async updateAppsMarketplaceInfo(appsOverview: Array<{ latest: IMarketplaceInfo }>): Promise<void> {
        await Promise.all(appsOverview.map(async ({ latest: appInfo }) => {
            if (!appInfo.subscriptionInfo) {
                return;
            }

            const app = this.apps.get(appInfo.id);

            if (!app) {
                return;
            }

            const appStorageItem = app.getStorageItem();
            const subscriptionInfo = appStorageItem.marketplaceInfo && appStorageItem.marketplaceInfo.subscriptionInfo;

            if (subscriptionInfo && subscriptionInfo.license.license === appInfo.subscriptionInfo.license.license) {
                return;
            }

            appStorageItem.marketplaceInfo.subscriptionInfo = appInfo.subscriptionInfo;

            return this.storage.update(appStorageItem);
        })).catch();

        const queue = [] as Array<Promise<void>>;

        this.apps.forEach((app) => queue.push(app.validateLicense()
            .then(() => {
                if (app.getStatus() !== AppStatus.INVALID_LICENSE_DISABLED) {
                    return;
                }

                return app.setStatus(AppStatus.DISABLED);
            })
            .catch((error) => {
                if (!(error instanceof InvalidLicenseError)) {
                    console.error(error);
                    return;
                }

                this.commandManager.unregisterCommands(app.getID());
                this.externalComponentManager.unregisterExternalComponents(app.getID());
                this.apiManager.unregisterApis(app.getID());

                return app.setStatus(AppStatus.INVALID_LICENSE_DISABLED);
            })
            .then(() => {
                if (app.getStatus() === app.getPreviousStatus()) {
                    return;
                }

                const storageItem = app.getStorageItem();
                storageItem.status = app.getStatus();

                return this.storage.update(storageItem).catch(console.error) as Promise<void>;
            }),
        ));

        await Promise.all(queue);
    }

    /**
     * Goes through the entire loading up process. WARNING: Do not use. ;)
     *
     * @param appId the id of the application to load
     */
    protected async loadOne(appId: string): Promise<ProxiedApp> {
        if (this.apps.get(appId)) {
            return this.apps.get(appId);
        }

        const item: IAppStorageItem = await this.storage.retrieveOne(appId);

        if (!item) {
            throw new Error(`No App found by the id of: "${ appId }"`);
        }

        this.apps.set(item.id, this.getCompiler().toSandBox(this, item));

        const rl = this.apps.get(item.id);
        await this.initializeApp(item, rl, false);

        if (!this.areRequiredSettingsSet(item)) {
            await rl.setStatus(AppStatus.INVALID_SETTINGS_DISABLED);
        }

        if (!AppStatusUtils.isDisabled(rl.getStatus()) && AppStatusUtils.isEnabled(rl.getPreviousStatus())) {
            await this.enableApp(item, rl, false, rl.getPreviousStatus() === AppStatus.MANUALLY_ENABLED);
        }

        return this.apps.get(item.id);
    }

    private async runStartUpProcess(storageItem: IAppStorageItem, app: ProxiedApp, isManual: boolean, silenceStatus: boolean): Promise<boolean> {
        if (app.getStatus() !== AppStatus.INITIALIZED) {
            const isInitialized = await this.initializeApp(storageItem, app, true, silenceStatus);
            if (!isInitialized) {
                return false;
            }
        }

        if (!this.areRequiredSettingsSet(storageItem)) {
            await app.setStatus(AppStatus.INVALID_SETTINGS_DISABLED, silenceStatus);
            return false;
        }

        return this.enableApp(storageItem, app, true, isManual, silenceStatus);
    }

    private async initializeApp(storageItem: IAppStorageItem, app: ProxiedApp, saveToDb = true, silenceStatus = false): Promise<boolean> {
        let result: boolean;
        const configExtend = this.getAccessorManager().getConfigurationExtend(storageItem.id);
        const envRead = this.getAccessorManager().getEnvironmentRead(storageItem.id);

        try {
            await app.validateLicense();

            await app.call(AppMethod.INITIALIZE, configExtend, envRead);
            await app.setStatus(AppStatus.INITIALIZED, silenceStatus);

            result = true;
        } catch (e) {
            let status = AppStatus.ERROR_DISABLED;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            if (e instanceof InvalidLicenseError) {
                status = AppStatus.INVALID_LICENSE_DISABLED;
            }

            console.error(e);
            this.commandManager.unregisterCommands(storageItem.id);
            this.externalComponentManager.unregisterExternalComponents(storageItem.id);
            this.apiManager.unregisterApis(storageItem.id);
            await this.schedulerManager.cancelAllJobs(storageItem.id);
            result = false;

            await app.setStatus(status, silenceStatus);
        }

        if (saveToDb) {
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            storageItem.status = app.getStatus();
            await this.storage.update(storageItem).catch();
        }

        return result;
    }

    /**
     * Determines if the App's required settings are set or not.
     * Should a packageValue be provided and not empty, then it's considered set.
     */
    private areRequiredSettingsSet(storageItem: IAppStorageItem): boolean {
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

    private async enableApp(storageItem: IAppStorageItem, app: ProxiedApp, saveToDb = true, isManual: boolean, silenceStatus = false): Promise<boolean> {
        let enable: boolean;

        try {
            await app.validateLicense();

            enable = await app.call(AppMethod.ONENABLE,
                this.getAccessorManager().getEnvironmentRead(storageItem.id),
                this.getAccessorManager().getConfigurationModify(storageItem.id)) as boolean;

            await app.setStatus(isManual ? AppStatus.MANUALLY_ENABLED : AppStatus.AUTO_ENABLED, silenceStatus);
        } catch (e) {
            enable = false;
            let status = AppStatus.ERROR_DISABLED;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            if (e instanceof InvalidLicenseError) {
                status = AppStatus.INVALID_LICENSE_DISABLED;
            }

            console.error(e);
            await app.setStatus(status, silenceStatus);
        }

        if (enable) {
            this.commandManager.registerCommands(app.getID());
            this.externalComponentManager.registerExternalComponents(app.getID());
            this.apiManager.registerApis(app.getID());
            this.listenerManager.registerListeners(app);
            this.listenerManager.releaseEssentialEvents(app);
        } else {
            this.commandManager.unregisterCommands(app.getID());
            this.externalComponentManager.unregisterExternalComponents(app.getID());
            this.apiManager.unregisterApis(app.getID());
            this.listenerManager.lockEssentialEvents(app);
            await this.schedulerManager.cancelAllJobs(app.getID());
        }

        if (saveToDb) {
            storageItem.status = app.getStatus();
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            await this.storage.update(storageItem).catch();
        }

        return enable;
    }

    private async createAppUser(app: ProxiedApp): Promise<string> {
        const appUser = await this.bridges.getUserBridge().getAppUser(app.getID());

        if (appUser) {
            return appUser.id;
        }

        const userData: Partial<IUser> = {
            username: app.getAppUserUsername(),
            name: app.getInfo().name,
            roles: ['app'],
            appId: app.getID(),
            type: UserType.APP,
            status: 'online',
            isEnabled: true,
        };

        return this.bridges.getUserBridge().create(userData, app.getID(), {
            avatarUrl: app.getInfo().iconFileContent || app.getInfo().iconFile,
            joinDefaultChannels: true,
            sendWelcomeEmail: false,
        });
    }

    private async removeAppUser(app: ProxiedApp): Promise<boolean> {
        const appUser = await this.bridges.getUserBridge().getAppUser(app.getID());

        if (!appUser) {
            return true;
        }

        return this.bridges.getUserBridge().remove(appUser, app.getID());
    }

    private async ensureAppUser(app: ProxiedApp): Promise<boolean> {
        const appUser = await this.bridges.getUserBridge().getAppUser(app.getID());

        if (appUser) {
            return true;
        }

        return !!this.createAppUser(app);
    }
}
