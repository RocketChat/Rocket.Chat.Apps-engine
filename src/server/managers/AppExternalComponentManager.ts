import { IExternalComponent } from '../../definition/externalComponent';
import { ExternalComponentAlreadyTouchedError, ExternalComponentNotMatchWithAppError } from '../errors';

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
    private registeredExternalComponents: Map<string, Map<string, IExternalComponent>>;
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
        this.registeredExternalComponents = new Map<string, Map<string, IExternalComponent>>();
        this.appTouchedExternalComponents = new Map<string, Map<string, IExternalComponent>>();
    }
    /**
     * Get all registered components.
     */
    public getRegisteredExternalComponents(): Map<string, Map<string, IExternalComponent>> {
        return this.registeredExternalComponents;
    }
    /**
     * Get all external components that apps have registered
     * before, including disabled apps' external components.
     */
    public getAppTouchedExternalComponents(): Map<string, Map<string, IExternalComponent>> {
        return this.appTouchedExternalComponents;
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
     * Add an external component to the appTouchedExternalComponents.
     *
     * @param appId the id of the app
     * @param externalComponent the external component need to be added
     */
    public addExternalComponent(appId: string, externalComponent: IExternalComponent): void {
        if (externalComponent.appId !== appId) {
            throw new ExternalComponentNotMatchWithAppError();
        }

        if (!this.appTouchedExternalComponents.get(appId)) {
            this.appTouchedExternalComponents.set(appId, new Map(Object.entries({ [externalComponent.name]: externalComponent})));
        } else {
            const appExternalComponents = this.appTouchedExternalComponents.get(appId);
            const touchedExternalComponent = appExternalComponents.get(externalComponent.name);

            if (
                touchedExternalComponent
                && touchedExternalComponent.name === externalComponent.name
                && JSON.stringify(touchedExternalComponent) !== JSON.stringify(externalComponent)
            ) {
                throw new ExternalComponentAlreadyTouchedError(touchedExternalComponent);
            }

            appExternalComponents.set(externalComponent.name, externalComponent);
        }
    }
    /**
     * Add enabled apps' external components from the appTouchedExternalComponents
     * to the registeredExternalComponents.
     *
     * @param appId the id of the app
     */
    public registerExternalComponents(appId: string): void {
        if (!this.appTouchedExternalComponents.has(appId)) {
            return;
        }

        const externalComponents = this.appTouchedExternalComponents.get(appId);

        this.registeredExternalComponents.set(appId, externalComponents);
    }
    /**
     * Remove all external components of an app from the
     * registeredExternalComponents by specifying the appId.
     *
     * @param appId the id of the app
     */
    public unregisterExternalComponents(appId: string): void {
        if (this.registeredExternalComponents.has(appId)) {
            this.registeredExternalComponents.delete(appId);
        }
    }
    /**
     * Remove all external components of an app from both the
     * registeredExternalComponents and the appTouchedComponents
     * by specifying the appId.
     *
     * @param appId the id of the app
     */
    public purgeExternalComponents(appId: string): void {
        if (this.appTouchedExternalComponents.has(appId)) {
            this.appTouchedExternalComponents.delete(appId);
        }
        if (this.registeredExternalComponents.has(appId)) {
            this.registeredExternalComponents.delete(appId);
        }
    }
}
