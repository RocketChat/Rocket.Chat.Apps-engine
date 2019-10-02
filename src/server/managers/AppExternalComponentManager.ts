import { IExternalComponent } from '../../definition/externalComponent';

/**
 * The external component manager for the apps.
 *
 * An app will register external components during its `initialize` method.
 * Then once an app's `onEnable` method is called and it returns true,
 * only then will that app's external components be enabled.
 */
export class AppExternalComponentManager {
    /**
     * The map that maintains all registered components.
     * The key of the top map is app id and the key of inner map is the
     * external component name.
     */
    private providedExternalComponents: Map<string, Map<string, IExternalComponent>>;
    /**
     * Contains the apps and the external components they have touhed.
     * The key of the top map is app id and the key of inner map is the
     * external component name.
     * Doesn't matter whether the app provided, modified, disabled,
     * or enabled. As long as an app touched external components, then
     * they are listed here.
     */
    private appTouchedExternalComponents: Map<string, Map<string, IExternalComponent>>;

    constructor() {
        this.providedExternalComponents = new Map<string, Map<string, IExternalComponent>>();
        this.appTouchedExternalComponents = new Map<string, Map<string, IExternalComponent>>();
    }
    /**
     * Add an external component to the appTouchedExternalComponents.
     *
     * @param appId the id of the app
     * @param externalComponent the external component need to be added
     */
    public addExternalComponent(appId: string, externalComponent: IExternalComponent): void {
        if (!this.appTouchedExternalComponents.get(appId)) {
            this.appTouchedExternalComponents.set(appId, new Map(Object.entries({ [externalComponent.name]: externalComponent})));
        } else {
            const appExternalComponents = this.appTouchedExternalComponents.get(appId);

            appExternalComponents.set(externalComponent.name, externalComponent);
        }
    }
    /**
     * Add external components to the providedExternalComponents.
     *
     * @param appId the id of the app
     * @param externalComponents the external components need to be registered
     */
    public registerExternalComponents(appId: string, externalComponents: Map<string, IExternalComponent>): void {
        this.providedExternalComponents.set(appId, externalComponents);
    }
    /**
     * Remove all external components of an app from the providedExternalComponents.
     * by specifying the appId.
     *
     * @param appId the id of the app
     */
    public unregisterExternalComponents(appId: string): void {
        if (this.providedExternalComponents.has(appId)) {
            this.providedExternalComponents.get(appId).clear();
        }
    }
    /**
     * Get all external components of an app by specifying the appId.
     *
     * @param appId the id of the app
     */
    public getExternalComponents(appId: string): Map<string, IExternalComponent> {
        if (this.appTouchedExternalComponents.has(appId)) {
            return this.appTouchedExternalComponents.get(appId);
        }

        return null;
    }
    /**
     * Remove all external components of an app from both the
     * providedExternalComponents and the appTouchedComponents by specifying the
     * appId.
     *
     * @param appId the id of the app
     */
    public purgeExternalComponents(appId: string): void {
        if (this.appTouchedExternalComponents.has(appId)) {
            this.appTouchedExternalComponents.get(appId).clear();
        }
        if (this.providedExternalComponents.has(appId)) {
            this.providedExternalComponents.get(appId).clear();
        }
    }
}
