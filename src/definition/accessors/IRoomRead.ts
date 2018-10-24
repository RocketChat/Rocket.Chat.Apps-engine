import { IMessage } from '../messages/index';
import { IRoom } from '../rooms/index';
import { IUser } from '../users/index';

/**
 * This accessor provides methods for accessing
 * rooms in a read-only-fashion.
 */
export interface IRoomRead {
    /**
     * Gets a room by an id.
     *
     * @param id the id of the room
     * @returns the room
     */
    getById(id: string): Promise<IRoom | undefined>;

    /**
     * Gets just the creator of the room by the room's id.
     *
     * @param id the id of the room
     * @returns the creator of the room
     */
    getCreatorUserById(id: string): Promise<IUser | undefined>;

    /**
     * Gets a room by its name.
     *
     * @param name the name of the room
     * @returns the room
     */
    getByName(name: string): Promise<IRoom | undefined>;

    /**
     * Gets just the creator of the room by the room's name.
     *
     * @param name the name of the room
     * @returns the creator of the room
     */
    getCreatorUserByName(name: string): Promise<IUser | undefined>;

    /**
     * Gets an iterator for all of the messages in the provided room.
     *
     * @param roomId the room's id
     * @returns an iterator for messages
     */
    getMessages(roomId: string): Promise<IterableIterator<IMessage>>;

    /**
     * Gets an iterator for all of the users in the provided room.
     *
     * @param roomId the room's id
     * @returns an iterator for the users in the room
     */
    getMembers(roomId: string): Promise<IterableIterator<IUser>>;
}
