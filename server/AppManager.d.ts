import { AppBridges } from './bridges';
import { AppCompiler, AppFabricationFulfillment, AppPackageParser } from './compiler';
import { IGetAppsFilter } from './IGetAppsFilter';
import { AppAccessorManager, AppListenerManger, AppSettingsManager, AppSlashCommandManager } from './managers';
import { ProxiedApp } from './ProxiedApp';
import { AppLogStorage, AppStorage } from './storage';
import { AppStatus } from '../definition/AppStatus';
export declare class AppManager {
    static Instance: AppManager;
    private readonly apps;
    private readonly storage;
    private readonly logStorage;
    private readonly bridges;
    private readonly parser;
    private readonly compiler;
    private readonly accessorManager;
    private readonly listenerManager;
    private readonly commandManager;
    private readonly settingsManager;
    private isLoaded;
    constructor(rlStorage: AppStorage, logStorage: AppLogStorage, rlBridges: AppBridges);
    /** Gets the instance of the storage connector. */
    getStorage(): AppStorage;
    /** Gets the instance of the log storage connector. */
    getLogStorage(): AppLogStorage;
    /** Gets the instance of the App package parser. */
    getParser(): AppPackageParser;
    /** Gets the compiler instance. */
    getCompiler(): AppCompiler;
    /** Gets the accessor manager instance. */
    getAccessorManager(): AppAccessorManager;
    /** Gets the instance of the Bridge manager. */
    getBridges(): AppBridges;
    /** Gets the instance of the listener manager. */
    getListenerManager(): AppListenerManger;
    /** Gets the command manager's instance. */
    getCommandManager(): AppSlashCommandManager;
    /** Gets the manager of the settings, updates and getting. */
    getSettingsManager(): AppSettingsManager;
    /** Gets whether the Apps have been loaded or not. */
    areAppsLoaded(): boolean;
    /**
     * Goes through the entire loading up process.
     * Expect this to take some time, as it goes through a very
     * long process of loading all the Apps up.
     */
    load(): Promise<Array<AppFabricationFulfillment>>;
    unload(isManual: boolean): Promise<void>;
    /** Gets the Apps which match the filter passed in. */
    get(filter?: IGetAppsFilter): Array<ProxiedApp>;
    /** Gets a single App by the id passed in. */
    getOneById(appId: string): ProxiedApp;
    enable(id: string): Promise<boolean>;
    disable(id: string, isManual?: boolean): Promise<boolean>;
    add(zipContentsBase64d: string, enable?: boolean): Promise<AppFabricationFulfillment>;
    remove(id: string): Promise<ProxiedApp>;
    update(zipContentsBase64d: string): Promise<AppFabricationFulfillment>;
    getLanguageContent(): {
        [key: string]: object;
    };
    changeStatus(appId: string, status: AppStatus): Promise<ProxiedApp>;
    /**
     * Goes through the entire loading up process. WARNING: Do not use. ;)
     *
     * @param appId the id of the application to load
     */
    protected loadOne(appId: string): Promise<ProxiedApp>;
    private runStartUpProcess(storageItem, app, isManual, silenceStatus);
    private initializeApp(storageItem, app, saveToDb?, silenceStatus?);
    /**
     * Determines if the App's required settings are set or not.
     * Should a packageValue be provided and not empty, then it's considered set.
     */
    private areRequiredSettingsSet(storageItem);
    private enableApp(storageItem, app, saveToDb, isManual, silenceStatus?);
}
