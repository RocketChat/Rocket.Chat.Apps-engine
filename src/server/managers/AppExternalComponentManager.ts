import { IExternalComponent } from '../../definition/externalComponent';

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
    /**
     * The map that maintain the list of all registered components.
     */
    private providedComponents: Map<string, IExternalComponent>;
    constructor() {
        this.providedComponents = new Map<string, IExternalComponent>();
    }
    /**
     * Add the external component to the providedComponents.
     * @param appId the id of the app calling this
     * @param externalComponent the external component to register
     */
    public registerComponent(appId: string, externalComponent: IExternalComponent): void {
        this.providedComponents.set(appId, externalComponent);
    }
}
