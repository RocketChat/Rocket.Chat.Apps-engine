import { IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';

import { AppServerCommunicator } from './AppServerCommunicator';

export class AppClientManager {
    private apps: Array<IAppInfo>;

    constructor(private readonly communicator: AppServerCommunicator) {
        if (!(communicator instanceof AppServerCommunicator)) {
            throw new Error('The communicator must extend AppServerCommunicator');
        }

        this.apps = new Array<IAppInfo>();
    }

    public async load(): Promise<void> {
         this.apps = await this.communicator.getEnabledApps();
         console.log('Enabled apps:', this.apps);
    }
}
