import { IUser } from '../users';
import { ILivechatUpdater } from './ILivechatUpdater';
import { IMessageBuilder } from './IMessageBuilder';
import { IRoomBuilder } from './IRoomBuilder';

export interface IModifyUpdater {
    /**
     * Get the updater object responsible for the
     * Livechat integrations
     */
    getLivechatUpdater(): ILivechatUpdater;

    /**
     * Modifies an existing message.
     * Raises an exception if a non-existent messageId is supplied
     *
     * @param messageId the id of the existing message to modfiy and build
     * @param updater the user who is updating the message
     */
    message(messageId: string, updater: IUser): Promise<IMessageBuilder>;

    /**
     * Modifies an existing room.
     * Raises an exception if a non-existent roomId is supplied
     *
     * @param roomId the id of the existing room to modify and build
     * @param updater the user who is updating the room
     */
    room(roomId: string, updater: IUser): Promise<IRoomBuilder>;

    /**
     * Finishes the updating process, saving the object to the database.
     * Note: If there is an issue or error while updating, this will throw an error.
     *
     * @param builder the builder instance
     */
    finish(builder: IMessageBuilder | IRoomBuilder): Promise<void>;
}
