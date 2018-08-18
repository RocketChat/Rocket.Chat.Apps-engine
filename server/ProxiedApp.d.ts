/// <reference types="node" />
import { ILogger } from '../definition/accessors';
import { App } from '../definition/App';
import { AppStatus } from '../definition/AppStatus';
import { IApp } from '../definition/IApp';
import { AppMethod, IAppAuthorInfo, IAppInfo } from '../definition/metadata';
import { IAppStorageItem } from './storage';
import * as vm from 'vm';
import { AppManager } from './AppManager';
import { AppConsole } from './logging/index';
export declare class ProxiedApp implements IApp {
    private readonly manager;
    private storageItem;
    private readonly app;
    private readonly customRequire;
    private previousStatus;
    constructor(manager: AppManager, storageItem: IAppStorageItem, app: App, customRequire: (mod: string) => {});
    getApp(): App;
    getStorageItem(): IAppStorageItem;
    setStorageItem(item: IAppStorageItem): void;
    getPreviousStatus(): AppStatus;
    getImplementationList(): {
        [inter: string]: boolean;
    };
    hasMethod(method: AppMethod): boolean;
    makeContext(data: object): vm.Context;
    setupLogger(method: AppMethod): AppConsole;
    runInContext(codeToRun: string, context: vm.Context): any;
    call(method: AppMethod, ...args: Array<any>): Promise<any>;
    getStatus(): AppStatus;
    setStatus(status: AppStatus, silent?: boolean): Promise<void>;
    getName(): string;
    getNameSlug(): string;
    getID(): string;
    getVersion(): string;
    getDescription(): string;
    getRequiredApiVersion(): string;
    getAuthorInfo(): IAppAuthorInfo;
    getInfo(): IAppInfo;
    getLogger(): ILogger;
}
