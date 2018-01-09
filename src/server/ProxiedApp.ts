import { ILogger } from '@rocket.chat/apps-ts-definition/accessors';
import { App } from '@rocket.chat/apps-ts-definition/App';
import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { IApp } from '@rocket.chat/apps-ts-definition/IApp';
import { IAppAuthorInfo, IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';

import { AppMethod } from './compiler';
import { NotEnoughMethodArgumentsError } from './errors';
import { IAppStorageItem } from './storage';

import * as vm from 'vm';

export class ProxiedApp implements IApp {
    private previousStatus: AppStatus;

    constructor(private storageItem: IAppStorageItem,
                private readonly app: App,
                private readonly customRequire: (mod: string) => {}) {
        this.previousStatus = storageItem.status;
    }

    public getStorageItem(): IAppStorageItem {
        return this.storageItem;
    }

    public setStorageItem(item: IAppStorageItem): void {
        this.storageItem = item;
    }

    public getPreviousStatus() {
        return this.previousStatus;
    }

    public hasMethod(method: AppMethod): boolean {
        console.log('Checking:', method);
        return typeof (this.app as any)[method] === 'function';
    }

    public call(method: AppMethod, ...args: Array<any>): any {
        if (typeof (this.app as any)[method] !== 'function') {
            throw new Error(`The App ${this.app.getName()} (${this.app.getID()}`
                + ` does not have the method: "${method}"`);
        }

        // tslint:disable-next-line
        const methodDeclartion = (this.app as any)[method] as Function;
        if (args.length < methodDeclartion.length) {
            throw new NotEnoughMethodArgumentsError(method, methodDeclartion.length, args.length);
        }

        const context = vm.createContext({
            app: this.app,
            args,
            require: this.customRequire,
            console: this.app.getLogger(),
        });

        this.app.getLogger().debug(`${method} is being called...`);
        // tslint:disable-next-line:max-line-length
        const result = vm.runInContext(`app.${method}.apply(app, args)`, context, { timeout: 1000 });
        this.app.getLogger().debug(`${method} was successfully called!`);

        return result;
    }

    public getStatus(): AppStatus {
        return this.app.getStatus();
    }

    public setStatus(status: AppStatus) {
        this.call(AppMethod.SETSTATUS, status);
    }

    public getName(): string {
        return this.app.getName();
    }

    public getNameSlug(): string {
        return this.app.getNameSlug();
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
}
