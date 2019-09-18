import { IExternalComponent } from '../../definition/externalComponent';

/**
 * The external component manager for the Apps.
 *
 * An App will register external component during their `initialize` method.
 * Then once an App's `onEnable` is called and it returns true,
 * only then will that App's external component be enabled.
 */
export class AppExternalComponentManager {
    /**
     * The map that maintain the list of all registered components.
     */
    private providedComponents: Map<string, IExternalComponent>;
    /**
     * Contains the apps and the external components they have touhed.
     * The key is appId and the value is external component.
     * Doesn't matter whether the app provided, modified, disabled,
     * or enabled. As long as an app touched an external component, then
     * it is listed here.
     */
    private appTouchedComponents: Map<string, IExternalComponent>;
    constructor() {
        this.providedComponents = new Map<string, IExternalComponent>();
        this.appTouchedComponents = new Map<string, IExternalComponent>();
    }
    /**
     * Add the external component to the appTouchedComponents.
     * @param appId the id of the app
     * @param externalComponent the external component to register
     * @param addToProvidedComponents whether also add the external
     * component to the providedComponents, the value is false by default.
     */
    public registerComponent(appId: string, externalComponent: IExternalComponent, addToProvidedComponents: boolean = false): void {
        this.appTouchedComponents.set(appId, externalComponent);

        if (addToProvidedComponents) {
            this.providedComponents.set(appId, externalComponent);
        }
    }
    /**
     * Remove the external compoent from the providedComponents by appId.
     * @param appId the id of the app
     */
    public unregisterComponent(appId: string): void {
        if (this.providedComponents.has(appId)) {
            this.providedComponents.delete(appId);
        }
    }
    /**
     * Get the external component by the appId.
     * @param appId the id of the app
     */
    public getExternalComponent(appId: string): IExternalComponent {
        if (this.appTouchedComponents.has(appId)) {
            return this.appTouchedComponents.get(appId);
        }

        return null;
    }
    /**
     * Remove the external compoent from both the providedComponents
     * and the appTouchedComponents by the appId.
     * @param appId the id of the app
     */
    public purgeComponent(appId: string): void {
        if (this.appTouchedComponents.has(appId)) {
            this.appTouchedComponents.delete(appId);
        }
        if (this.providedComponents.has(appId)) {
            this.providedComponents.delete(appId);
        }
    }
}
