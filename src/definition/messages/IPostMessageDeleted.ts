import { IHttp, IPersistence, IRead } from '../accessors';
import { IMessage } from './IMessage';

/** Handler for after a message is deleted. */
export interface IPostMessageDeleted {
    /**
     * Enables the handler to signal to the Apps framework whether
     * this handler should actually be executed for after the message
     * has been deleted.
     *
     * @param message The message which was deleted
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns whether to run the executor function
     */
    checkPostMessageDeleted?(message: IMessage, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method called *after* the message has been deleted.
     *
     * @param message The message which was deleted
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    executePostMessageDeleted(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
