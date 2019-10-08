import { ISubscription } from '../subscriptions/ISubscription';

/**
 * This accessor provides methods for accessing
 * subscriptions in a read-only-fashion.
 */
export interface ISubscriptionRead {
    /**
     * Gets a list of subscriptions by a room id.
     *
     * @param roomId the id of the room
     * @returns an iterator of subscriptions
     */
    getByRoomId(roomId: string): Promise<IterableIterator<ISubscription>>;
}
