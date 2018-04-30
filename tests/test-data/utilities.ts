// tslint:disable:max-classes-per-file

import { TestsAppBridges } from './bridges/appBridges';
import { TestsAppLogStorage } from './logStorage';
import { TestsAppStorage } from './storage';

import { AppBridges } from '../../src/server/bridges';
import { AppLogStorage, AppStorage } from '../../src/server/storage';

export class TestInfastructureSetup {
    private appStorage: TestsAppStorage;
    private logStorage: TestsAppLogStorage;
    private bridges: TestsAppBridges;

    constructor() {
        this.appStorage = new TestsAppStorage();
        this.logStorage = new TestsAppLogStorage();
        this.bridges = new TestsAppBridges();
    }

    public getAppStorage(): AppStorage {
        return this.appStorage;
    }

    public getLogStorage(): AppLogStorage {
        return this.logStorage;
    }

    public getAppBridges(): AppBridges {
        return this.bridges;
    }
}

export const TestsData = new TestInfastructureSetup();

export class SimpleClass {
    private readonly world: string;
    constructor(world = 'Earith') {
        this.world = world;
    }

    public getWorld(): string {
        return this.world;
    }
}
