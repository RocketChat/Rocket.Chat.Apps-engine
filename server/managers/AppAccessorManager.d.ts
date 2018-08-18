import { AppManager } from '../AppManager';
import { IConfigurationExtend, IConfigurationModify, IEnvironmentRead, IHttp, IModify, IPersistence, IRead } from '../../definition/accessors';
export declare class AppAccessorManager {
    private readonly manager;
    private readonly bridges;
    private readonly configExtenders;
    private readonly envReaders;
    private readonly configModifiers;
    private readonly readers;
    private readonly modifiers;
    private readonly persists;
    private readonly https;
    constructor(manager: AppManager);
    /**
     * Purifies the accessors for the provided App.
     *
     * @param appId The id of the App to purge the accessors for.
     */
    purifyApp(appId: string): void;
    getConfigurationExtend(appId: string): IConfigurationExtend;
    getEnvironmentRead(appId: string): IEnvironmentRead;
    getConfigurationModify(appId: string): IConfigurationModify;
    getReader(appId: string): IRead;
    getModifier(appId: string): IModify;
    getPersistence(appId: string): IPersistence;
    getHttp(appId: string): IHttp;
}
