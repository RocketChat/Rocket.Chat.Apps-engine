import { IExternalComponent } from '../../definition/externalComponent';

import { AppManager } from '../AppManager';
import { IExternalComponentBridge } from '../bridges';

/**
 * The external component manager for the Apps.
 *
 * An App will register external component during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's external component be enabled.
 *
 * Registered means the component has been provided to the bridged system.
 */
export class AppExternalComponentManager {
    private readonly bridge: IExternalComponentBridge;
    constructor(private readonly manager: AppManager) {
        this.bridge = this.manager.getBridges().getExternalComponentBridge();
    }
    /**
     * Actually goes and provide's the bridged system with the external
     * component information.
     * @param appId the id of the app calling this
     * @param externalComponent the external component to register
     */
    public registerComponent(appId: string, externalComponent: IExternalComponent): void {
        this.bridge.registerExternalComponent(externalComponent, appId);
    }
}
