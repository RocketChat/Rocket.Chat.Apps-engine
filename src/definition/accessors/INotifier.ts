import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUIKitResponse } from '../uikit';
import { IUser } from '../users';
import { IMessageBuilder } from './IMessageBuilder';

export interface INotifier {
    /**
     * Notifies the provided user of the provided message.
     *
     * **Note**: Notifications only are shown to the user if they are
     * online and it only stays around for the duration of their session.
     *
     * @param user The user who should be notified
     * @param message The message with the content to notify the user about
     */
    notifyUser(user: IUser, message: IMessage): Promise<void>;

    /**
     * Notifies all of the users in the provided room.
     *
     * **Note**: Notifications only are shown to those online
     * and it only stays around for the duration of their session.
     *
     * @param room The room which to notify the users in
     * @param message The message content to notify users about
     */
    notifyRoom(room: IRoom, message: IMessage): Promise<void>;

    sendUiInteration(user: IUser, interaction: IUIKitResponse): Promise<void>;

    /** Gets a new message builder for building a notification message. */
    getMessageBuilder(): IMessageBuilder;
}
