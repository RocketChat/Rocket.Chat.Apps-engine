import { IUser } from '../users';
import { IMessageExtender } from './IMessageExtender';
import { IRoomExtender } from './IRoomExtender';

export interface IModifyExtender {
    /**
     * Modifies a message in a non-destructive way: Properties can be added to it,
     * but existing properties cannot be changed.
     *
     * @param messageId the id of the message to be extended
     * @param updater the user who is updating/extending the message
     * @return the extender instance for the message
     */
    extendMessage(messageId: string, updater: IUser): Promise<IMessageExtender>;

    /**
     * Modifies a room in a non-destructive way: Properties can be added to it,
     * but existing properties cannot be changed.
     *
     * @param roomId the id of the room to be extended
     * @param updater the user who is updating/extending the room
     * @return the extender instance for the room
     */
    extendRoom(roomId: string, updater: IUser): Promise<IRoomExtender>;

    /**
     * Finishes the extending process, saving the object to the database.
     * Note: If there is an issue or error while updating, this will throw an error.
     *
     * @param extender the extender instance
     */
    finish(extender: IRoomExtender | IMessageExtender): Promise<void>;
}
