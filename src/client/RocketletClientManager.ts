import { Rocketlet } from 'temporary-rocketlets-ts-definition/Rocketlet';

import { IRocketletServerCommunicator } from './IRocketletServerCommunicator';

export class RocketletClientManager {
    private rocketlets: Array<Rocketlet>;

    constructor(private readonly communicator: IRocketletServerCommunicator) {
        this.rocketlets = new Array<Rocketlet>();
    }

    public async load(): Promise<void> {
         this.rocketlets = await this.communicator.getEnabledRocketlets();
    }
}
