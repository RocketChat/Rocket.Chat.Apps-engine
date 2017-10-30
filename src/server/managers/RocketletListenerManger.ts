import { RocketletManager } from '../RocketletManager';

export class RocketletListenerManger {
    constructor(private readonly manager: RocketletManager) { }

    public async registerListeners(): Promise<void> {
        this.manager.get({ enabled: true }); // TODO: Determine what to do
        return;
    }
}
