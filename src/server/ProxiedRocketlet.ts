import { ILogger } from 'temporary-rocketlets-ts-definition/accessors';
import { IRocketlet } from 'temporary-rocketlets-ts-definition/IRocketlet';
import { IRocketletAuthorInfo, IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

import { NotEnoughMethodArgumentsError } from './errors/index';

import * as vm from 'vm';

export class ProxiedRocketlet implements IRocketlet {
    constructor(private readonly rocketlet: Rocketlet, private readonly customRequire: (mod: string) => {}) { }

    public call(method: string, ...args: Array<any>): any {
        if (typeof (this.rocketlet as any)[method] !== 'function') {
            throw new Error(`The Rocketlet ${this.rocketlet.getName()} (${this.rocketlet.getID()}`
                + ` does not have the method: "${method}"`);
        }

        // tslint:disable-next-line
        const methodDeclartion = (this.rocketlet as any)[method] as Function;
        console.log(methodDeclartion, methodDeclartion.length);
        if (args.length !== methodDeclartion.length) {
            throw new NotEnoughMethodArgumentsError(method, methodDeclartion.length, args.length);
        }

        const context = vm.createContext({
            rocketlet: this.rocketlet,
            args,
            require: this.customRequire,
        });

        this.rocketlet.getLogger().debug(`${method} is being called...`);
        const result = vm.runInContext(`rocketlet.${method}(...args)`, context, { timeout: 100 });
        this.rocketlet.getLogger().debug(`${method} was successfully called!`);

        return result;
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
