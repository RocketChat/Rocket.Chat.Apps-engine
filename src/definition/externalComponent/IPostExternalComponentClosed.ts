import { IHttp, IPersistence, IRead } from '../accessors';
import { IExternalComponent } from './IExternalComponent';

/**
 * Handler called after an external component is closed.
 */
export interface IPostExternalComponentClosed {
    /**
     * Enables the handler to signal the apps engine whether this handler
     * should actually be executed after the external component is closed.
     *
     * @param externalComponent The external component which was closed
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns Whether to run the execute function or not
     */
    checkPostExternalComponentClosed?(externalComponent: IExternalComponent, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method called after an external component is closed.
     *
     * @param externalComponent The external component which was closed
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     */
    executePostExternalComponentClosed(externalComponent: IExternalComponent, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
