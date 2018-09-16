import { IHttp, IPersistence, IRead } from '../accessors';
import { INotification } from './INotification';

/** Handler for after a notification is sent. */
export interface IPostNotificationSent {
    /**
     * Enables the handler to signal to the Apps framework whether
     * this handler should actually be executed for after the notification
     * has been sent.
     *
     * @param notification The notification which was sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns whether to run the executor function
     */
    checkPostNotificationSent?(notification: INotification, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method called *after* the notification is sent.
     *
     * @param notification The notification which was sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    executePostNotificationSent(notification: INotification, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
