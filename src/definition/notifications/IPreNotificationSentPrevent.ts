import { IHttp, IPersistence, IRead } from '../accessors';
import { INotification } from './INotification';

/**  Handler which is called to determine whether a user is allowed to send a notification or not. */
export interface IPreNotificationSentPrevent {
    /**
     * Enables the handler to signal to the Apps framework whether
     * this handler should actually be executed for the notification
     * about to be sent.
     *
     * @param notification The message which is being sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @returns whether to run the prevent or not
     */
    checkPreNotificationSentPrevent?(notification: INotification, read: IRead, http: IHttp): Promise<boolean>;

    /**
     * Method which is to be used to prevent a notification from being sent.
     *
     * @param notification The message about to be sent
     * @param read An accessor to the environment
     * @param http An accessor to the outside world
     * @param persistence An accessor to the App's persistence storage
     * @returns whether to prevent the notification from being sent
     */
    executePreNotificationSentPrevent(notification: INotification, read: IRead, http: IHttp, persistence: IPersistence): Promise<boolean>;
}
