import { IDesktopNotificationExtender, IHttp, IPersistence, IRead } from '../accessors';
import { IDesktopNotification } from './IDesktopNotification';

/** Handler called when an App wants to enrich a desktop notification. */
export interface IPreDesktopNotificationSentExtend {
    /**
     * Enables the handler to signal to the Apps framework whether
     * this handler should actually be executed for the DesktopNotification
     * about to be sent.
     *
     * @param notification The notification which is being sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns whether to run the execute or not
     */
    checkPreDesktopNotificationSentExtend?(notification: IDesktopNotification, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method which is to be used to non-destructively enrich the notification.
     * The implementer should extend the message by using the `extend` parameter
     *
     * @param notification The notification about to be sent
     * @param extend An accessor for modifying the notification non-destructively
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence storage
     * @returns void
     */
    executePreDesktopNotificationSentExtend(
        notification: IDesktopNotification,
        extend: IDesktopNotificationExtender,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
    ): Promise<void>;
}
