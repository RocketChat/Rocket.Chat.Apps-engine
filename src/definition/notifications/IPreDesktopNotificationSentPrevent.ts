import { IHttp, IPersistence, IRead } from '../accessors';
import { IDesktopNotification } from './IDesktopNotification';

/**  Handler which is called to determine whether the system should send a desktop notification or not. */
export interface IPreDesktopNotificationSentPrevent {
    /**
     * Enables the handler to signal to the Apps framework whether
     * this handler should actually be executed for the desktop notification
     * about to be sent.
     *
     * @param notification The message which is being sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns whether to run the prevent or not
     */
    checkPreDesktopNotificationSentPrevent?(notification: IDesktopNotification, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method which is to be used to prevent a desktop notification from being sent.
     *
     * @param notification The message about to be sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence storage
     * @returns whether to prevent the notification from being sent
     */
    executePreDesktopNotificationSentPrevent(notification: IDesktopNotification, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean>;
}
