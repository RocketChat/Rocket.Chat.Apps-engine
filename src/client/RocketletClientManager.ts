import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';

import { RocketletServerCommunicator } from './RocketletServerCommunicator';

export class RocketletClientManager {
    private rocketlets: Array<IRocketletInfo>;

    constructor(private readonly communicator: RocketletServerCommunicator) {
        if (!(communicator instanceof RocketletServerCommunicator)) {
            throw new Error('The communicator must extend RocketletServerCommunicator');
        }

        this.rocketlets = new Array<IRocketletInfo>();
    }

    public async load(): Promise<void> {
         this.rocketlets = await this.communicator.getEnabledRocketlets();
    }
}
