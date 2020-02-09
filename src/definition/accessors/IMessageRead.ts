import { IMessage } from '../messages/index';
import { IRoom } from '../rooms/IRoom';
import { IUser } from '../users/IUser';

/**
 * This accessor provides methods for accessing
 * messages in a read-only-fashion.
 */
export interface IMessageRead {
    /**
     * Gets the entire ID of the message.
     */
    getById(): IMessage;

    /**
     * Gets the User which sent the message.
     */
    getSenderUser(): IUser;

    /**
     * Gets the room where this message was sent to.
     */
    getRoom(): IRoom;
}
   
