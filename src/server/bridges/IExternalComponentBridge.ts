import { IExternalComponent } from '../../definition/externalComponent';

/**
 * The interface which should be implemented for the external component
 * to be registered.
 */
export interface IExternalComponentBridge {
    /**
     * Registers an external component with the system which is being bridged.
     * @param externalComponent the external component to register
     * @param appId the id of the app calling this
     */
    registerExternalComponent(externalComponent: IExternalComponent, appId: string): void;
}
