import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

import { RocketletServerCommunicator } from './RocketletServerCommunicator';

export class RocketletClientManager {
    private rocketlets: Array<Rocketlet>;

    constructor(private readonly communicator: RocketletServerCommunicator) {
        if (!(communicator instanceof RocketletServerCommunicator)) {
            throw new Error('The communicator must extend RocketletServerCommunicator');
        }

        this.rocketlets = new Array<Rocketlet>();
    }

    public async load(): Promise<void> {
         this.rocketlets = await this.communicator.getEnabledRocketlets();
    }
}
