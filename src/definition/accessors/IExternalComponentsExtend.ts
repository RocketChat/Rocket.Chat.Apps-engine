import { IExternalComponent } from '../externalComponent';

/**
 * This accessor provides methods for register an external
 * component. Provided during the initialization of your App.
 */
export interface IExternalComponentExtend {
    /**
     * Register an external component to the system. It actually calls
     * addExternalComponent method of AppExternalComponentManager internally,
     * adding the external component to appTouchedExternalComponents map.
     *
     * @param externalComponent the external component to be registered
     */
    register(externalComponent: IExternalComponent): Promise<void>;
}
