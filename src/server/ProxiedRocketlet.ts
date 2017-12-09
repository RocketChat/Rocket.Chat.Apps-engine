import { ILogger } from 'temporary-rocketlets-ts-definition/accessors';
import { IRocketlet } from 'temporary-rocketlets-ts-definition/IRocketlet';
import { IRocketletAuthorInfo, IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';
import { RocketletStatus } from 'temporary-rocketlets-ts-definition/RocketletStatus';

import { RocketletMethod } from './compiler';
import { NotEnoughMethodArgumentsError } from './errors';
import { IRocketletStorageItem } from './storage';

import * as vm from 'vm';

export class ProxiedRocketlet implements IRocketlet {
    private previousStatus: RocketletStatus;

    constructor(private storageItem: IRocketletStorageItem,
                private readonly rocketlet: Rocketlet,
                private readonly customRequire: (mod: string) => {}) {
        this.previousStatus = storageItem.status;
    }

    public getStorageItem(): IRocketletStorageItem {
        return this.storageItem;
    }

    public setStorageItem(item: IRocketletStorageItem): void {
        this.storageItem = item;
    }

    public getPreviousStatus() {
        return this.previousStatus;
    }

    public hasMethod(method: RocketletMethod): boolean {
        console.log('Checking:', method);
        return typeof (this.rocketlet as any)[method] === 'function';
    }

    public call(method: RocketletMethod, ...args: Array<any>): any {
        if (typeof (this.rocketlet as any)[method] !== 'function') {
            throw new Error(`The Rocketlet ${this.rocketlet.getName()} (${this.rocketlet.getID()}`
                + ` does not have the method: "${method}"`);
        }

        // tslint:disable-next-line
        const methodDeclartion = (this.rocketlet as any)[method] as Function;
        if (args.length < methodDeclartion.length) {
            throw new NotEnoughMethodArgumentsError(method, methodDeclartion.length, args.length);
        }

        const context = vm.createContext({
            rocketlet: this.rocketlet,
            args,
            require: this.customRequire,
            console: this.rocketlet.getLogger(),
        });

        this.rocketlet.getLogger().debug(`${method} is being called...`);
        // tslint:disable-next-line:max-line-length
        const result = vm.runInContext(`rocketlet.${method}.apply(rocketlet, args)`, context, { timeout: 1000 });
        this.rocketlet.getLogger().debug(`${method} was successfully called!`);

        return result;
    }

    public getStatus(): RocketletStatus {
        return this.rocketlet.getStatus();
    }

    public setStatus(status: RocketletStatus) {
        this.call(RocketletMethod.SETSTATUS, status);
    }

    public getName(): string {
        return this.rocketlet.getName();
    }

    public getNameSlug(): string {
        return this.rocketlet.getNameSlug();
    }

    public getID(): string {
        return this.rocketlet.getID();
    }

    public getVersion(): string {
        return this.rocketlet.getVersion();
    }

    public getDescription(): string {
        return this.rocketlet.getDescription();
    }

    public getRequiredApiVersion(): string {
        return this.rocketlet.getRequiredApiVersion();
    }
    public getAuthorInfo(): IRocketletAuthorInfo {
        return this.rocketlet.getAuthorInfo();
    }

    public getInfo(): IRocketletInfo {
        return this.rocketlet.getInfo();
    }

    public getLogger(): ILogger {
        return this.rocketlet.getLogger();
    }
}
