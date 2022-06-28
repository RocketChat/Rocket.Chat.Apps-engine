import { Buffer } from 'buffer';
import { AppStatus, AppStatusUtils } from '../definition/AppStatus';
import { AppMethod, IAppInfo } from '../definition/metadata';
import { IPermission } from '../definition/permissions/IPermission';
import { IUser, UserType } from '../definition/users';
import { AppBridges, PersistenceBridge, UserBridge } from './bridges';
import { IInternalPersistenceBridge } from './bridges/IInternalPersistenceBridge';
import { IInternalUserBridge } from './bridges/IInternalUserBridge';
import { AppCompiler, AppFabricationFulfillment, AppPackageParser } from './compiler';
import { InvalidLicenseError } from './errors';
import { IGetAppsFilter } from './IGetAppsFilter';
import {
    AppAccessorManager, AppApiManager, AppExternalComponentManager, AppLicenseManager, AppListenerManager, AppSchedulerManager, AppSettingsManager,
    AppSlashCommandManager, AppVideoConfProviderManager,
} from './managers';
import { UIActionButtonManager } from './managers/UIActionButtonManager';
import { IMarketplaceInfo } from './marketplace';
import { DisabledApp } from './misc/DisabledApp';
import { defaultPermissions } from './permissions/AppPermissions';
import { ProxiedApp } from './ProxiedApp';
import { AppLogStorage, AppMetadataStorage, IAppStorageItem } from './storage';
import { AppSourceStorage } from './storage/AppSourceStorage';

export interface IAppInstallParameters {
    enable: boolean;
    marketplaceInfo?: IMarketplaceInfo;
    permissionsGranted?: Array<IPermission>;
    user: IUser;
}

export interface IAppUninstallParameters {
    user: IUser;
}

export interface IAppManagerDeps {
    metadataStorage: AppMetadataStorage;
    logStorage: AppLogStorage;
    bridges: AppBridges;
    sourceStorage: AppSourceStorage;
}

export class AppManager {
    public static Instance: AppManager;

    // apps contains all of the Apps
    private readonly apps: Map<string, ProxiedApp>;
    private readonly appMetadataStorage: AppMetadataStorage;
    private appSourceStorage: AppSourceStorage;
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
    private readonly uiActionButtonManager: UIActionButtonManager;
    private readonly videoConfProviderManager: AppVideoConfProviderManager;

    private isLoaded: boolean;

    constructor({ metadataStorage, logStorage, bridges, sourceStorage }: IAppManagerDeps) {
        // Singleton style. There can only ever be one AppManager instance
        if (typeof AppManager.Instance !== 'undefined') {
            throw new Error('There is already a valid AppManager instance');
        }

        if (metadataStorage instanceof AppMetadataStorage) {
            this.appMetadataStorage = metadataStorage;
        } else {
            throw new Error('Invalid instance of the AppMetadataStorage');
        }

        if (logStorage instanceof AppLogStorage) {
            this.logStorage = logStorage;
        } else {
            throw new Error('Invalid instance of the AppLogStorage');
        }

        if (bridges instanceof AppBridges) {
            this.bridges = bridges;
        } else {
            throw new Error('Invalid instance of the AppBridges');
        }

        if (sourceStorage instanceof AppSourceStorage) {
            this.appSourceStorage = sourceStorage;
        } else {
            throw new Error('Invalid instance of the AppSourceStorage');
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
        this.uiActionButtonManager = new UIActionButtonManager(this);
        this.videoConfProviderManager = new AppVideoConfProviderManager(this);

        this.isLoaded = false;
        AppManager.Instance = this;
    }

    /** Gets the instance of the storage connector. */
    public getStorage(): AppMetadataStorage {
        return this.appMetadataStorage;
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

    public getVideoConfProviderManager(): AppVideoConfProviderManager {
        return this.videoConfProviderManager;
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

    public getUIActionButtonManager(): UIActionButtonManager {
        return this.uiActionButtonManager;
    }

    /** Gets whether the Apps have been loaded or not. */
    public areAppsLoaded(): boolean {
        return this.isLoaded;
    }

    public setSourceStorage(storage: AppSourceStorage): void {
        this.appSourceStorage = storage;
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

        const items: Map<string, IAppStorageItem> = await this.appMetadataStorage.retrieveAll();
        const affs: Array<AppFabricationFulfillment> = new Array<AppFabricationFulfillment>();

        for (const item of items.values()) {
            const aff = new AppFabricationFulfillment();

            try {
                aff.setAppInfo(item.info);
                aff.setImplementedInterfaces(item.implemented);

                const appPackage = await this.appSourceStorage.fetch(item);
                const unpackageResult = await this.getParser().unpackageApp(appPackage);

                const app = this.getCompiler().toSandBox(this, item, unpackageResult);

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
                // We still have to validate its license, though
                await rl.validateLicense();

                continue;
            }

            await this.initializeApp(items.get(rl.getID()), rl, false, true).catch(console.error);
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
                this.uiActionButtonManager.clearAppActionButtons(app.getID());
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
                await this.purgeAppConfig(app);
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

    public getPermissionsById(appId: string): Array<IPermission> {
        const app = this.apps.get(appId);

        if (!app) {
            return [];
        }
        const { permissionsGranted } = app.getStorageItem();

        return permissionsGranted || defaultPermissions;
    }

    public async enable(id: string): Promise<boolean> {
        const rl = this.apps.get(id);

        if (!rl) {
            throw new Error(`No App by the id "${ id }" exists.`);
        }

        if (AppStatusUtils.isEnabled(rl.getStatus())) {
            return true;
        }

        if (rl.getStatus() === AppStatus.COMPILER_ERROR_DISABLED) {
            throw new Error('The App had compiler errors, can not enable it.');
        }

        const storageItem = await this.appMetadataStorage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not enable an App with the id of "${ id }" as it doesn't exist.`);
        }

        const isSetup = await this.runStartUpProcess(storageItem, rl, true, false);
        if (isSetup) {
            storageItem.status = rl.getStatus();
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            await this.appMetadataStorage.update(storageItem).catch();
        }

        return isSetup;
    }

    public async disable(id: string, status: AppStatus = AppStatus.DISABLED, silent?: boolean): Promise<boolean> {
        if (!AppStatusUtils.isDisabled(status)) {
            throw new Error('Invalid disabled status');
        }

        const app = this.apps.get(id);

        if (!app) {
            throw new Error(`No App by the id "${ id }" exists.`);
        }

        if (AppStatusUtils.isEnabled(app.getStatus())) {
            await app.call(AppMethod.ONDISABLE, this.accessorManager.getConfigurationModify(app.getID()))
                .catch((e) => console.warn('Error while disabling:', e));
        }

        await this.purgeAppConfig(app, true);

        await app.setStatus(status, silent);

        const storageItem = await this.appMetadataStorage.retrieveOne(id);

        app.getStorageItem().marketplaceInfo = storageItem.marketplaceInfo;
        await app.validateLicense().catch();

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = app.getStatus();
        await this.appMetadataStorage.update(storageItem).catch();

        return true;
    }

    public async add(appPackage: Buffer, installationParameters: IAppInstallParameters): Promise<AppFabricationFulfillment> {
        const { enable = true, marketplaceInfo, permissionsGranted, user } = installationParameters;

        const aff = new AppFabricationFulfillment();
        const result = await this.getParser().unpackageApp(appPackage);
        const undoSteps: Array<() => void> = [];

        aff.setAppInfo(result.info);
        aff.setImplementedInterfaces(result.implemented.getValues());

        const descriptor: IAppStorageItem = {
            id: result.info.id,
            info: result.info,
            status: AppStatus.UNKNOWN,
            settings: {},
            implemented: result.implemented.getValues(),
            marketplaceInfo,
            permissionsGranted,
            languageContent: result.languageContent,
        };

        try {
            descriptor.sourcePath = await this.appSourceStorage.store(descriptor, appPackage);

            undoSteps.push(() => this.appSourceStorage.remove(descriptor));
        } catch (error) {
            aff.setStorageError('Failed to store app package');

            return aff;
        }

        // Now that is has all been compiled, let's get the
        // the App instance from the source.
        const app = this.getCompiler().toSandBox(this, descriptor, result);

        // Create a user for the app
        try {
            await this.createAppUser(result.info);

            undoSteps.push(() => this.removeAppUser(app));
        } catch (err) {
            aff.setAppUserError({
                username: app.getAppUserUsername(),
                message: 'Failed to create an app user for this app.',
            });

            await Promise.all(undoSteps.map((undoer) => undoer()));

            return aff;
        }

        const created = await this.appMetadataStorage.create(descriptor);

        if (!created) {
            aff.setStorageError('Failed to create the App, the storage did not return it.');

            await Promise.all(undoSteps.map((undoer) => undoer()));

            return aff;
        }

        this.apps.set(app.getID(), app);
        aff.setApp(app);

        // Let everyone know that the App has been added
        await this.bridges.getAppActivationBridge().doAppAdded(app).catch(() => {
            // If an error occurs during this, oh well.
        });

        await this.installApp(created, app, user);

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
    /**
     * Uninstalls specified app from the server and remove
     * all database records regarding it
     *
     * @returns the instance of the removed ProxiedApp
     */
    public async remove(id: string, uninstallationParameters: IAppUninstallParameters): Promise<ProxiedApp> {
        const app = this.apps.get(id);
        const { user } = uninstallationParameters;

        await this.uninstallApp(app, user);

        // Let everyone know that the App has been removed
        await this.bridges.getAppActivationBridge().doAppRemoved(app).catch();

        await this.removeLocal(id);

        return app;
    }

    /**
     * Removes the app instance from the local Apps container
     * and every type of data associated with it
     */
    public async removeLocal(id: string): Promise<void> {
        const app = this.apps.get(id);

        if (AppStatusUtils.isEnabled(app.getStatus())) {
            await this.disable(id);
        }

        await this.purgeAppConfig(app);
        this.listenerManager.releaseEssentialEvents(app);
        await this.removeAppUser(app);
        await (this.bridges.getPersistenceBridge() as IInternalPersistenceBridge & PersistenceBridge).purge(app.getID());
        await this.appMetadataStorage.remove(app.getID());
        await this.appSourceStorage.remove(app.getStorageItem()).catch();

        this.apps.delete(app.getID());
    }

    public async update(appPackage: Buffer, permissionsGranted: Array<IPermission>, updateOptions = { loadApp: true }): Promise<AppFabricationFulfillment> {
        const aff = new AppFabricationFulfillment();
        const result = await this.getParser().unpackageApp(appPackage);

        aff.setAppInfo(result.info);
        aff.setImplementedInterfaces(result.implemented.getValues());

        const old = await this.appMetadataStorage.retrieveOne(result.info.id);

        if (!old) {
            throw new Error('Can not update an App that does not currently exist.');
        }

        // If there is any error during disabling, it doesn't really matter
        await this.disable(old.id).catch(() => {});

        const descriptor: IAppStorageItem = {
            ...old,
            createdAt: old.createdAt,
            id: result.info.id,
            info: result.info,
            status: this.apps.get(old.id)?.getStatus() || old.status,
            languageContent: result.languageContent,
            settings: old.settings,
            implemented: result.implemented.getValues(),
            marketplaceInfo: old.marketplaceInfo,
            sourcePath: old.sourcePath,
            permissionsGranted,
        };

        try {
            descriptor.sourcePath = await this.appSourceStorage.update(descriptor, appPackage);
        } catch (error) {
            aff.setStorageError('Failed to storage app package');

            return aff;
        }

        const stored = await this.appMetadataStorage.update(descriptor);

        const app = this.getCompiler().toSandBox(this, descriptor, result);

        // Ensure there is an user for the app
        try {
            await this.createAppUser(result.info);
        } catch (err) {
            aff.setAppUserError({
                username: `${ result.info.nameSlug }.bot`,
                message: 'Failed to create an app user for this app.',
            });

            return aff;
        }

        aff.setApp(app);

        if (updateOptions.loadApp) {
            await this.updateLocal(stored, app);

            await this.bridges.getAppActivationBridge().doAppUpdated(app).catch(() => {});
        }

        return aff;
    }

    /**
     * Updates the local instance of an app.
     *
     * If the second parameter is a Buffer of an app package,
     * unpackage and instantiate the app's main class
     *
     * With an instance of a ProxiedApp, start it up and replace
     * the reference in the local app collection
     */
    public async updateLocal(stored: IAppStorageItem, appPackageOrInstance: ProxiedApp | Buffer) {
        const app = await (async () => {
            if (appPackageOrInstance instanceof Buffer) {
                const parseResult = await this.getParser().unpackageApp(appPackageOrInstance);

                return this.getCompiler().toSandBox(this, stored, parseResult);
            }

            return appPackageOrInstance;
        })();

        await this.purgeAppConfig(app);

        this.apps.set(app.getID(), app);

        await this.runStartUpProcess(stored, app, false, true);
    }

    public getLanguageContent(): { [key: string]: object } {
        const langs: { [key: string]: object } = {};

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

            return this.appMetadataStorage.update(appStorageItem);
        })).catch();

        const queue = [] as Array<Promise<void>>;

        this.apps.forEach((app) => queue.push(app.validateLicense()
            .then(() => {
                if (app.getStatus() !== AppStatus.INVALID_LICENSE_DISABLED) {
                    return;
                }

                return app.setStatus(AppStatus.DISABLED);
            })
            .catch(async (error) => {
                if (!(error instanceof InvalidLicenseError)) {
                    console.error(error);
                    return;
                }

                await this.purgeAppConfig(app);

                return app.setStatus(AppStatus.INVALID_LICENSE_DISABLED);
            })
            .then(() => {
                if (app.getStatus() === app.getPreviousStatus()) {
                    return;
                }

                const storageItem = app.getStorageItem();
                storageItem.status = app.getStatus();

                return this.appMetadataStorage.update(storageItem).catch(console.error) as Promise<void>;
            }),
        ));

        await Promise.all(queue);
    }

    /**
     * Goes through the entire loading up process.
     *
     * @param appId the id of the application to load
     */
    protected async loadOne(appId: string): Promise<ProxiedApp> {
        if (this.apps.get(appId)) {
            return this.apps.get(appId);
        }

        const item: IAppStorageItem = await this.appMetadataStorage.retrieveOne(appId);
        const appPackage = await this.appSourceStorage.fetch(item);
        const unpackageResult = await this.getParser().unpackageApp(appPackage);

        if (!item) {
            throw new Error(`No App found by the id of: "${ appId }"`);
        }

        this.apps.set(item.id, this.getCompiler().toSandBox(this, item, unpackageResult));

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

    private async installApp(storageItem: IAppStorageItem, app: ProxiedApp, user: IUser): Promise<boolean> {
        let result: boolean;
        const read = this.getAccessorManager().getReader(storageItem.id);
        const http = this.getAccessorManager().getHttp(storageItem.id);
        const persistence = this.getAccessorManager().getPersistence(storageItem.id);
        const modifier = this.getAccessorManager().getModifier(storageItem.id);
        const context = { user };

        try {
            await app.call(AppMethod.ONINSTALL, context, read, http, persistence, modifier);

            result = true;
        } catch (e) {
            const status = AppStatus.ERROR_DISABLED;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                app.getLogger().warn('Please report the following error:');
            }

            result = false;

            await app.setStatus(status);
        }

        return result;
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

            await this.purgeAppConfig(app);
            result = false;

            await app.setStatus(status, silenceStatus);
        }

        if (saveToDb) {
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            storageItem.status = app.getStatus();
            await this.appMetadataStorage.update(storageItem).catch();
        }

        return result;
    }

    private async purgeAppConfig(app: ProxiedApp, isDisabled: boolean = false) {
        if (!isDisabled) {
            await this.schedulerManager.cleanUp(app.getID());
        }
        this.listenerManager.unregisterListeners(app);
        this.listenerManager.lockEssentialEvents(app);
        this.commandManager.unregisterCommands(app.getID());
        this.externalComponentManager.unregisterExternalComponents(app.getID());
        this.apiManager.unregisterApis(app.getID());
        this.accessorManager.purifyApp(app.getID());
        this.uiActionButtonManager.clearAppActionButtons(app.getID());
        this.videoConfProviderManager.unregisterProviders(app.getID());
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
        let status = AppStatus.ERROR_DISABLED;

        try {
            await app.validateLicense();

            enable = await app.call(AppMethod.ONENABLE,
                this.getAccessorManager().getEnvironmentRead(storageItem.id),
                this.getAccessorManager().getConfigurationModify(storageItem.id)) as boolean;

            if (enable) {
                status = isManual ? AppStatus.MANUALLY_ENABLED : AppStatus.AUTO_ENABLED;
            } else {
                status = AppStatus.DISABLED;
                app.getLogger().warn(
                    `The App (${ app.getID() }) disabled itself when being enabled. \n` +
                    `Check the "onEnable" implementation for details.`,
                );
            }
        } catch (e) {
            enable = false;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            if (e instanceof InvalidLicenseError) {
                status = AppStatus.INVALID_LICENSE_DISABLED;
            }

            console.error(e);
        }

        if (enable) {
            this.commandManager.registerCommands(app.getID());
            this.externalComponentManager.registerExternalComponents(app.getID());
            this.apiManager.registerApis(app.getID());
            this.listenerManager.registerListeners(app);
            this.listenerManager.releaseEssentialEvents(app);
            this.videoConfProviderManager.registerProviders(app.getID());
        } else {
            await this.purgeAppConfig(app);
        }

        if (saveToDb) {
            storageItem.status = status;
            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            await this.appMetadataStorage.update(storageItem).catch();
        }

        await app.setStatus(status, silenceStatus);

        return enable;
    }

    private async createAppUser(appInfo: IAppInfo): Promise<string> {
        const appUser = await (this.bridges.getUserBridge() as IInternalUserBridge & UserBridge).getAppUser(appInfo.id);

        if (appUser) {
            return appUser.id;
        }

        const userData: Partial<IUser> = {
            username: `${ appInfo.nameSlug }.bot`,
            name: appInfo.name,
            roles: ['app'],
            appId: appInfo.id,
            type: UserType.APP,
            status: 'online',
            isEnabled: true,
        };

        return (this.bridges.getUserBridge() as IInternalUserBridge & UserBridge).create(userData, appInfo.id, {
            avatarUrl: appInfo.iconFileContent || appInfo.iconFile,
            joinDefaultChannels: true,
            sendWelcomeEmail: false,
        });
    }

    private async removeAppUser(app: ProxiedApp): Promise<boolean> {
        const appUser = await (this.bridges.getUserBridge() as IInternalUserBridge & UserBridge).getAppUser(app.getID());

        if (!appUser) {
            return true;
        }

        return (this.bridges.getUserBridge() as IInternalUserBridge & UserBridge).remove(appUser, app.getID());
    }

    private async uninstallApp(app: ProxiedApp, user: IUser): Promise<boolean> {
        let result: boolean;
        const read = this.getAccessorManager().getReader(app.getID());
        const http = this.getAccessorManager().getHttp(app.getID());
        const persistence = this.getAccessorManager().getPersistence(app.getID());
        const modifier = this.getAccessorManager().getModifier(app.getID());
        const context = { user };

        try {
            await app.call(AppMethod.ONUNINSTALL, context, read, http, persistence, modifier);

            result = true;
        } catch (e) {
            const status = AppStatus.ERROR_DISABLED;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                app.getLogger().warn('Please report the following error:');
            }

            result = false;

            await app.setStatus(status);
        }

        return result;
    }
}

export const getPermissionsByAppId = (appId: string) => {
    if (!AppManager.Instance) {
        console.error('AppManager should be instantiated first');
        return [];
    }
    return AppManager.Instance.getPermissionsById(appId);
};
