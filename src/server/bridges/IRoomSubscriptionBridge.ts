import { IRoomSubscription } from '../../definition/subscriptions';

export interface IRoomSubscriptionBridge {
    getByRoomId(roomId: string, appId: string): Promise<IterableIterator<IRoomSubscription>>;

    getByUserId(userId: string, appId: string): Promise<IterableIterator<IRoomSubscription>>;
}
