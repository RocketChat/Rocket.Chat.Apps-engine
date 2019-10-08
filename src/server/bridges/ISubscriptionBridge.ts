import { ISubscription } from '../../definition/subscriptions';

export interface ISubscriptionBridge {
    getByRoomId(roomId: string, appId: string): Promise<IterableIterator<ISubscription>>;
}
