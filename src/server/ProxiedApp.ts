import type { IAppAccessors, ILogger } from '../definition/accessors';
import { AppStatus } from '../definition/AppStatus';
import type { IApp } from '../definition/IApp';
import type { IAppAuthorInfo, IAppInfo } from '../definition/metadata';
import { AppMethod } from '../definition/metadata';
import type { AppManager } from './AppManager';
import { InvalidInstallationError } from './errors/InvalidInstallationError';
import { AppConsole } from './logging';
import { AppLicenseValidationResult } from './marketplace/license';
import type { DenoRuntimeSubprocessController } from './runtime/AppsEngineDenoRuntime';
import type { AppsEngineRuntime } from './runtime/AppsEngineRuntime';
import type { IAppStorageItem } from './storage';

export class ProxiedApp implements IApp {
    private previousStatus: AppStatus;

    private latestLicenseValidationResult: AppLicenseValidationResult;

    constructor(private readonly manager: AppManager, private storageItem: IAppStorageItem, private readonly appRuntime: DenoRuntimeSubprocessController) {
        this.previousStatus = storageItem.status;
    }

    public getRuntime(): AppsEngineRuntime {
        return this.manager.getRuntime();
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
        return true; // TODO: needs refactor, remove usages
    }

    public setupLogger(method: `${AppMethod}`): AppConsole {
        const logger = new AppConsole(method);

        return logger;
    }

    public async call(method: `${AppMethod}`, ...args: Array<any>): Promise<any> {
        const logger = this.setupLogger(method);

        try {
            const result = await this.appRuntime.sendRequest({ method, params: args });

            logger.debug('Result:', result);

            return result;
        } catch (e) {
            logger.error('Error:', e);

            throw e;
        } finally {
            await this.manager.getLogStorage().storeEntries(AppConsole.toStorageEntry(this.getID(), logger));
        }
    }

    public getStatus(): AppStatus {
        // return this.appRuntime.getStatus();
        return AppStatus.UNKNOWN; // TODO: need to circle back on this one
    }

    public async setStatus(status: AppStatus, silent?: boolean): Promise<void> {
        await this.call(AppMethod.SETSTATUS, status);

        if (!silent) {
            await this.manager.getBridges().getAppActivationBridge().doAppStatusChanged(this, status);
        }
    }

    public getName(): string {
        return this.storageItem.info.name;
    }

    public getNameSlug(): string {
        return this.storageItem.info.nameSlug;
    }

    public getAppUserUsername(): string {
        // return this.app.getAppUserUsername();
        return 'some-username'; // TODO: need to circle back on this one
    }

    public getID(): string {
        return this.storageItem.id;
    }

    public getVersion(): string {
        return this.storageItem.info.version;
    }

    public getDescription(): string {
        return this.storageItem.info.description;
    }

    public getRequiredApiVersion(): string {
        return this.storageItem.info.requiredApiVersion;
    }

    public getAuthorInfo(): IAppAuthorInfo {
        return this.storageItem.info.author;
    }

    public getInfo(): IAppInfo {
        return this.storageItem.info;
    }

    public getLogger(): ILogger {
        // return this.app.getLogger();
        return new AppConsole('constructor'); // TODO: need to circle back on this one
    }

    public getAccessors(): IAppAccessors {
        // return this.app.getAccessors();
        return {} as IAppAccessors; // TODO: need to circle back on this one
    }

    public getEssentials(): IAppInfo['essentials'] {
        return this.getInfo().essentials;
    }

    public getLatestLicenseValidationResult(): AppLicenseValidationResult {
        return this.latestLicenseValidationResult;
    }

    public async validateInstallation(): Promise<void> {
        try {
            await this.manager.getSignatureManager().verifySignedApp(this.getStorageItem());
        } catch (e) {
            throw new InvalidInstallationError(e.message);
        }
    }

    public validateLicense(): Promise<void> {
        const { marketplaceInfo } = this.getStorageItem();

        this.latestLicenseValidationResult = new AppLicenseValidationResult();

        return this.manager.getLicenseManager().validate(this.latestLicenseValidationResult, marketplaceInfo);
    }
}
