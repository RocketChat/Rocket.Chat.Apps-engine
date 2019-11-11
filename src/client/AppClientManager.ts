import { IAppInfo } from '../definition/metadata';

import { AppsEngineUIHost } from './AppsEngineUIHost';
import { AppServerCommunicator } from './AppServerCommunicator';

export class AppClientManager {
    private apps: Array<IAppInfo>;

    constructor(
        private readonly appClientUIHost: AppsEngineUIHost,
        private readonly communicator?: AppServerCommunicator,
    ) {
        if (!(appClientUIHost instanceof AppsEngineUIHost)) {
            throw new Error('The appClientUIHost must extend appClientUIHost');
        }

        if (communicator && !(communicator instanceof AppServerCommunicator)) {
            throw new Error('The communicator must extend AppServerCommunicator');
        }

        this.apps = new Array<IAppInfo>();
    }

    public async load(): Promise<void> {
         this.apps = await this.communicator.getEnabledApps();
         console.log('Enabled apps:', this.apps);
    }

    public async initialize(): Promise<void> {
        this.appClientUIHost.initialize();
    }
}
