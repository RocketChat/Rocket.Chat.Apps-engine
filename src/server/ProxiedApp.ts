import * as vm from 'vm';
import { IAppAccessors, ILogger } from '../definition/accessors';
import { App } from '../definition/App';
import { AppStatus } from '../definition/AppStatus';
import { AppsEngineException } from '../definition/exceptions';
import { IApp } from '../definition/IApp';
import { AppMethod, IAppAuthorInfo, IAppInfo } from '../definition/metadata';
import { AppManager } from './AppManager';
import { NotEnoughMethodArgumentsError } from './errors';
import { AppConsole } from './logging';
import { AppLicenseValidationResult } from './marketplace/license';
import { IAppStorageItem } from './storage';

export const ROCKETCHAT_APP_EXECUTION_PREFIX = '$RocketChat_App$';

export class ProxiedApp implements IApp {
    private previousStatus: AppStatus;

    private latestLicenseValidationResult: AppLicenseValidationResult;

    constructor(private readonly manager: AppManager,
                private storageItem: IAppStorageItem,
                private readonly app: App,
                private readonly customRequire: (mod: string) => {}) {
        this.previousStatus = storageItem.status;
    }

    public getApp(): App {
        return this.app;
    }

    public getStorageItem(): IAppStorageItem {
        return this.storageItem;
    }

    public setStorageItem(item: IAppStorageItem): void {
        this.storageItem = item;
    }

    public getPreviousStatus(): AppStatus {
        return this.previousStatus;
    }

    public getImplementationList(): { [inter: string]: boolean } {
        return this.storageItem.implemented;
    }

    public hasMethod(method: AppMethod): boolean {
        return typeof (this.app as any)[method] === 'function';
    }

    public makeContext(data: object): vm.Context {
        return vm.createContext(Object.assign({}, {
            require: this.customRequire,
        }, data));
    }

    public setupLogger(method: AppMethod): AppConsole {
        const logger = new AppConsole(method);
        // Set the logger to our new one
        (this.app as any).logger = logger;

        return logger;
    }

    public runInContext(codeToRun: string, context: vm.Context): any {
        return vm.runInContext(codeToRun, context, {
            timeout: 1000,
            filename: `${ ROCKETCHAT_APP_EXECUTION_PREFIX }_${ this.getName() }.ts`,
        });
    }

    public async call(method: AppMethod, ...args: Array<any>): Promise<any> {
        if (typeof (this.app as any)[method] !== 'function') {
            throw new Error(`The App ${this.app.getName()} (${this.app.getID()}`
                + ` does not have the method: "${method}"`);
        }

        // tslint:disable-next-line
        const methodDeclartion = (this.app as any)[method] as Function;
        if (args.length < methodDeclartion.length) {
            throw new NotEnoughMethodArgumentsError(method, methodDeclartion.length, args.length);
        }

        const logger = this.setupLogger(method);
        logger.debug(`${method} is being called...`);

        let result;
        try {
            // tslint:disable-next-line:max-line-length
            result = await this.runInContext(`app.${method}.apply(app, args)`, this.makeContext({ app: this.app, args })) as Promise<any>;
            logger.debug(`'${method}' was successfully called! The result is:`, result);
        } catch (e) {
            logger.error(e);
            logger.debug(`'${method}' was unsuccessful.`);

            if (e instanceof AppsEngineException) {
                throw e;
            }
        }

        this.manager.getLogStorage().storeEntries(this.getID(), logger);

        return result;
    }

    public getStatus(): AppStatus {
        return this.app.getStatus();
    }

    public async setStatus(status: AppStatus, silent?: boolean): Promise<void> {
        await this.call(AppMethod.SETSTATUS, status);

        if (!silent) {
            await this.manager.getBridges().getAppActivationBridge().appStatusChanged(this, status);
        }
    }

    public getName(): string {
        return this.app.getName();
    }

    public getNameSlug(): string {
        return this.app.getNameSlug();
    }

    public getAppUserUsername(): string {
        return this.app.getAppUserUsername();
    }

    public getID(): string {
        return this.app.getID();
    }

    public getVersion(): string {
        return this.app.getVersion();
    }

    public getDescription(): string {
        return this.app.getDescription();
    }

    public getRequiredApiVersion(): string {
        return this.app.getRequiredApiVersion();
    }
    public getAuthorInfo(): IAppAuthorInfo {
        return this.app.getAuthorInfo();
    }

    public getInfo(): IAppInfo {
        return this.app.getInfo();
    }

    public getLogger(): ILogger {
        return this.app.getLogger();
    }

    public getAccessors(): IAppAccessors {
        return this.app.getAccessors();
    }

    public getEssentials(): IAppInfo['essentials'] {
        return this.getInfo().essentials;
    }

    public getLatestLicenseValidationResult(): AppLicenseValidationResult {
        return this.latestLicenseValidationResult;
    }

    public validateLicense(): Promise<void> {
        const { marketplaceInfo } = this.getStorageItem();

        this.latestLicenseValidationResult = new AppLicenseValidationResult();

        return this.manager.getLicenseManager().validate(this.latestLicenseValidationResult, marketplaceInfo);
    }
}
