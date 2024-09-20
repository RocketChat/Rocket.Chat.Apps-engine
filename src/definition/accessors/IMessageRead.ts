import type { GetMessagesOptions } from '../../server/bridges/RoomBridge';
import type { IMessage, IMessageRaw } from '../messages/index';
import type { IRoom } from '../rooms/IRoom';
import type { IUser } from '../users/IUser';

/**
 * This accessor provides methods for accessing
 * messages in a read-only-fashion.
 */
export interface IMessageRead {
    getById(id: string): Promise<IMessage | undefined>;

    getSenderUser(messageId: string): Promise<IUser | undefined>;

    getRoom(messageId: string): Promise<IRoom | undefined>;

    /**
     * Retrieves an array of unread messages for a specific user in a specific room.
     *
     * @param roomId The unique identifier of the room from which to retrieve unread messages.
     * @param uid The unique identifier of the user for whom to retrieve unread messages.
     * @param options Optional parameters for retrieving messages:
     *                - limit: The maximum number of messages to retrieve. If more than 100 is passed, it defaults to 100.
     *                - skip: The number of messages to skip (for pagination).
     *                - sort: An object defining the sorting order of the messages. Each key is a field to sort by, and the value is either 1 for ascending order or -1 for descending order.
     * @returns A Promise that resolves to an array of IMessage objects representing the unread messages for the specified user in the specified room.
     */
    getUnreadByRoomAndUser(roomId: string, uid: string, options?: Partial<GetMessagesOptions>): Promise<IMessageRaw[]>;
}
