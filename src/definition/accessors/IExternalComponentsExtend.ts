import { IExternalComponent } from '../externalComponent';

/**
 * This accessor provides methods for register an external
 * component. Provided during the initialization of your App.
 */
export interface IExternalComponentExtend {
    register(externalComponent: IExternalComponent): Promise<void>;
}
