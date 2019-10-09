import { IRoomSubscription } from '../subscriptions';

/**
 * This accessor provides methods for accessing
 * subscriptions in a read-only-fashion.
 */
export interface IRoomSubscriptionRead {
    /**
     * Gets a list of subscriptions by a room id.
     *
     * @param roomId the id of the room
     * @returns an iterator of subscriptions
     */
    getByRoomId(roomId: string): Promise<AsyncIterableIterator<IRoomSubscription>>;

    /**
     * Gets a list of all the subscriptions for a user by their id.
     *
     * @param userId the id of the user
     * @returns an iterator of subscriptions for the user
     */
    getByUserId(userId: string): Promise<AsyncIterableIterator<IRoomSubscription>>;
}
