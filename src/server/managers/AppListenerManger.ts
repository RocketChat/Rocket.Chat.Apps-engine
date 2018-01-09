import { AppManager } from '../AppManager';

export class AppListenerManger {
    constructor(private readonly manager: AppManager) { }

    public async registerListeners(): Promise<void> {
        this.manager.get({ enabled: true }); // TODO: Determine what to do
        return;
    }
}
