import { AppBridges } from './bridges';
import { AppCompiler, AppMethod, AppPackageParser } from './compiler';
import { IGetAppsFilter } from './IGetAppsFilter';
import {
    AppAccessorManager,
    AppListenerManger,
    AppLoggerManager,
    AppSettingsManager,
    AppSlashCommandManager,
} from './managers';
import { ProxiedApp } from './ProxiedApp';
import { AppStorage, IAppStorageItem } from './storage';

import { AppStatus, AppStatusUtils } from '@rocket.chat/apps-ts-definition/AppStatus';

export class AppManager {
    public static ENV_VAR_NAME_FOR_ENABLING = 'USE_UNRELEASED_ROCKETAPPS_FRAMEWORK';
    public static SUPER_FUN_ENV_ENABLEMENT_NAME = 'LET_ME_HAVE_FUN_WITH_ROCKETS_NOW';

    // apps contains all of the Apps
    private readonly apps: Map<string, ProxiedApp>;
    private readonly storage: AppStorage;
    private readonly bridges: AppBridges;
    private readonly parser: AppPackageParser;
    private readonly compiler: AppCompiler;

    private readonly accessorManager: AppAccessorManager;
    private readonly listenerManager: AppListenerManger;
    private readonly logger: AppLoggerManager;
    private readonly commandManager: AppSlashCommandManager;
    private readonly settingsManager: AppSettingsManager;

    private isLoaded: boolean;

    constructor(rlStorage: AppStorage, rlBridges: AppBridges) {
        console.log('Constructed the AppManager.');

        if (rlStorage instanceof AppStorage) {
            this.storage = rlStorage;
        } else {
            throw new Error('Invalid instance of the AppStorage.');
        }

        if (rlBridges instanceof AppBridges) {
            this.bridges = rlBridges;
        } else {
            throw new Error('Invalid instance of the AppBridges');
        }

        this.apps = new Map<string, ProxiedApp>();

        this.parser = new AppPackageParser(this);
        this.logger = new AppLoggerManager();
        this.compiler = new AppCompiler(this.logger);
        this.accessorManager = new AppAccessorManager(this);
        this.listenerManager = new AppListenerManger(this);
        this.commandManager = new AppSlashCommandManager(this.bridges.getCommandBridge(), this.accessorManager);
        this.settingsManager = new AppSettingsManager(this);

        this.isLoaded = false;
    }

    /** Gets the instance of the storage connector. */
    public getStorage(): AppStorage {
        return this.storage;
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
    public getListenerManager(): AppListenerManger {
        return this.listenerManager;
    }

    /** Gets the command manager's instance. */
    public getCommandManager(): AppSlashCommandManager {
        return this.commandManager;
    }

    /** Gets the manager of the settings, updates and getting. */
    public getSettingsManager(): AppSettingsManager {
        return this.settingsManager;
    }

    /** Gets whether the Apps have been loaded or not. */
    public areAppsLoaded(): boolean {
        return this.isLoaded;
    }

    /**
     * Goes through the entire loading up process.
     * Except this to take some time, as it goes through a very
     * long process of loading all the Apps up.
     */
    public async load(): Promise<Array<ProxiedApp>> {
        const items: Map<string, IAppStorageItem> = await this.storage.retrieveAll();

        items.forEach((item: IAppStorageItem) => {
            try {
                this.apps.set(item.id, this.getCompiler().toSandBox(item));
            } catch (e) {
                // TODO: Handle this better. Create a way to show that it is disabled due to an
                // unrecoverable error and they need to either update or remove it. #7
                console.warn(`Error while compiling the Rocketlet "${ item.info.name } (${ item.id })":`, e);
            }
        });

        // Let's initialize them
        this.apps.forEach((rl) => this.initializeApp(items.get(rl.getID()), rl));

        // Now let's enable the apps which were once enabled
        this.apps.forEach((rl) => {
            if (AppStatusUtils.isEnabled(rl.getPreviousStatus())) {
                this.enableApp(items.get(rl.getID()), rl);
            }
        });

        // TODO: Register all of the listeners

        this.isLoaded = true;
        return Array.from(this.apps.values());
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
            throw new Error(`The App with the id "${id}" is already enabled.`);
        }

        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not enable a App with the id of "${id}" as it doesn't exist.`);
        }

        const isSetup = this.runStartUpProcess(storageItem, rl);
        if (isSetup) {
            rl.setStatus(AppStatus.MANUALLY_ENABLED);

            // This is async, but we don't care since it only updates in the database
            // and it should not mutate any properties we care about
            storageItem.status = rl.getStatus();
            this.storage.update(storageItem);

            try {
                this.bridges.getAppActivationBridge().appEnabled(rl);
            } catch (e) {
                // If an error occurs during this, oh well.
            }
        }

        return isSetup;
    }

    public async disable(id: string, isManual = false): Promise<boolean> {
        const rl = this.apps.get(id);

        if (!rl) {
            throw new Error(`No App by the id "${id}" exists.`);
        }

        if (!AppStatusUtils.isEnabled(rl.getStatus())) {
            throw new Error(`No App by the id of "${id}" is enabled."`);
        }

        const storageItem = await this.storage.retrieveOne(id);
        if (!storageItem) {
            throw new Error(`Could not disable a App with the id of "${id}" as it doesn't exist.`);
        }

        try {
            rl.call(AppMethod.ONDISABLE, this.accessorManager.getConfigurationModify(storageItem.id));
        } catch (e) {
            console.warn('Error while disabling:', e);
        }

        this.commandManager.unregisterCommands(storageItem.id);
        this.accessorManager.purifyApp(storageItem.id);

        if (isManual) {
            rl.setStatus(AppStatus.MANUALLY_DISABLED);
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = rl.getStatus();
        this.storage.update(storageItem);

        try {
            this.bridges.getAppActivationBridge().appDisabled(rl);
        } catch (e) {
            // If an error occurs during this, oh well.
        }

        return true;
    }

    public async add(zipContentsBase64d: string, enable = true): Promise<ProxiedApp> {
        const result = await this.getParser().parseZip(zipContentsBase64d);
        const created = await this.storage.create({
            id: result.info.id,
            info: result.info,
            status: AppStatus.UNKNOWN,
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            languageContent: result.languageContent,
            settings: {},
        });

        if (!created) {
            throw new Error('Failed to create the App, the storage did not return it.');
        }

        // Now that is has all been compiled, let's get the
        // the App instance from the source.
        const app = this.getCompiler().toSandBox(created);

        this.apps.set(app.getID(), app);

        // Should enable === true, then we go through the entire start up process
        // Otherwise, we only initialize it.
        if (enable) {
            // Start up the app
            this.runStartUpProcess(created, app);
        } else {
            this.initializeApp(created, app);
        }

        try {
            const isEnabled = AppStatusUtils.isEnabled(app.getStatus());
            this.bridges.getAppActivationBridge().appLoaded(app, isEnabled);
        } catch (e) {
            // If an error occurs during this, oh well.
        }

        return app;
    }

    public async remove(id: string): Promise<ProxiedApp> {
        await this.disable(id);

        const rl = this.apps.get(id);

        this.bridges.getPersistenceBridge().purge(rl.getID());
        await this.storage.remove(rl.getID());

        this.apps.delete(rl.getID());

        return rl;
    }

    public async update(zipContentsBase64d: string): Promise<ProxiedApp> {
        const result = await this.getParser().parseZip(zipContentsBase64d);
        const old = await this.storage.retrieveOne(result.info.id);

        if (!old) {
            throw new Error('Can not update a App that does not currently exist.');
        }

        // Attempt to disable it, if it wasn't enabled then it will error and we don't care
        try {
            await this.disable(old.id);
        } catch (e) {
            // We don't care
        }

        const stored = await this.storage.update({
            createdAt: old.createdAt,
            id: result.info.id,
            info: result.info,
            status: this.apps.get(old.id).getStatus(),
            zip: zipContentsBase64d,
            compiled: result.compiledFiles,
            languageContent: result.languageContent,
            settings: old.settings,
        });

        // Now that is has all been compiled, let's get the
        // the App instance from the source.
        const app = this.getCompiler().toSandBox(stored);

        // Store it temporarily so we can access it else where
        this.apps.set(app.getID(), app);

        // Start up the app
        this.runStartUpProcess(stored, app);

        try {
            const isEnabled = AppStatusUtils.isEnabled(app.getStatus());
            this.bridges.getAppActivationBridge().appUpdated(app, isEnabled);
        } catch (e) {
            // If an error occurs during this, oh well.
        }

        return app;
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
                throw new Error('Invalid status to change a App to, must be manually disabled or enabled.');
        }

        const rl = this.apps.get(appId);

        if (!rl) {
            throw new Error('Can not change the status of a App which does not currently exist.');
        }

        if (AppStatusUtils.isEnabled(status)) {
            // Then enable it
            if (AppStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('Can not enable a App which is already enabled.');
            }

            await this.enable(rl.getID());
        } else {
            if (!AppStatusUtils.isEnabled(rl.getStatus())) {
                throw new Error('Can not disable a App which is not enabled.');
            }

            await this.disable(rl.getID(), true);
        }

        return rl;
    }

    private runStartUpProcess(storageItem: IAppStorageItem, app: ProxiedApp): boolean {
        if (app.getStatus() !== AppStatus.INITIALIZED) {
            const isInitialized = this.initializeApp(storageItem, app);
            if (!isInitialized) {
                return false;
            }
        }

        const isEnabled = this.enableApp(storageItem, app);
        if (!isEnabled) {
            return false;
        }

        // TODO: Register all of the listeners

        return true;
    }

    private initializeApp(storageItem: IAppStorageItem, app: ProxiedApp): boolean {
        let result: boolean;
        const configExtend = this.getAccessorManager().getConfigurationExtend(storageItem.id);
        const envRead = this.getAccessorManager().getEnvironmentRead(storageItem.id);

        try {
            app.call(AppMethod.INITIALIZE, configExtend, envRead);
            result = true;
            app.setStatus(AppStatus.INITIALIZED);
        } catch (e) {
            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            console.error(e);
            this.commandManager.unregisterCommands(storageItem.id);
            result = false;

            app.setStatus(AppStatus.ERROR_DISABLED);
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = app.getStatus();
        this.storage.update(storageItem);

        return result;
    }

    private enableApp(storageItem: IAppStorageItem, app: ProxiedApp): boolean {
        let enable: boolean;

        try {
            enable = app.call(AppMethod.ONENABLE,
                this.getAccessorManager().getEnvironmentRead(storageItem.id),
                this.getAccessorManager().getConfigurationModify(storageItem.id)) as boolean;
            app.setStatus(AppStatus.AUTO_ENABLED);
        } catch (e) {
            enable = false;

            if (e.name === 'NotEnoughMethodArgumentsError') {
                console.warn('Please report the following error:');
            }

            console.error(e);
            app.setStatus(AppStatus.ERROR_DISABLED);
        }

        if (enable) {
            this.commandManager.registerCommands(app.getID());
        } else {
            this.commandManager.unregisterCommands(app.getID());
        }

        // This is async, but we don't care since it only updates in the database
        // and it should not mutate any properties we care about
        storageItem.status = app.getStatus();
        this.storage.update(storageItem);

        return enable;
    }
}
