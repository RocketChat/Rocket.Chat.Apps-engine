import { IMessage } from '../messages';
import { IUser } from '../users';

export interface IModerationModify {
    /**
     * Provides a way for Apps to report a message.
     * @param messageId the messageId to report
     * @param description the description of the report
     * @param userId the userId to be reported
     * @param appId the app id
     */
    report(messageId: string, description: string, userId: string, appId: string): Promise<void>;

    /**
     * Provides a way for Apps to delete a message.
     * @param message the message to be deleted
     * @param user the user who is deleting the message
     * @param reason the reason for deleting the message
     * @param action the action to be taken
     * @param appId the app id
     * @returns
     * @throws {Error} if the message is not found
     * @throws {Error} if the user is not found
     */
    deleteMessage(message: IMessage, user: IUser, reason: string, action: string, appId: string): Promise<void>;

    /**
     * Provides a way for Apps to deactivate a user.
     * @param userId the userId to be deactivated
     * @param confirmRelinquish whether the user relinquishes their own account
     * @param reason the reason for deactivating the user
     * @param action the action to be taken
     * @param appId the app id
     * @returns
     * @throws {Error} if the user is not found
     * @throws {Error} if the user is the last owner of a room, and confirmRelinquish is false
     */
    deactivateUser(userId: IUser['id'], confirmRelinquish: boolean, reason: string, action: string, appId: string): Promise<void>;

    /**
     * Provides a way for Apps to reset a user's avatar.
     * @param userId the userId to reset the avatar
     * @param appId the app id
     * @returns
     * @throws {Error} if the user is not found
     */
    resetUserAvatar(userId: IUser['id'], appId: string): Promise<void>;
}
