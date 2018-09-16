import { IHttp, IPersistence, IRead } from '../accessors';
import { IDesktopNotification } from './IDesktopNotification';

/** Handler for after a desktop notification has been sent. */
export interface IPostDesktopNotificationSent {
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
    checkPostDesktopNotificationSent?(notification: IDesktopNotification, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method called *after* the notification is sent.
     *
     * @param notification The notification which was sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence
     */
    executePostDesktopNotificationSent(notification: IDesktopNotification, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
