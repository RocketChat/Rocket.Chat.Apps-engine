import { IRoomSubscription } from '../../definition/subscriptions';

export interface IRoomSubscriptionBridge {
    getByRoomId(roomId: string, appId: string): Promise<AsyncIterableIterator<IRoomSubscription>>;

    getByUserId(userId: string, appId: string): Promise<AsyncIterableIterator<IRoomSubscription>>;
}
