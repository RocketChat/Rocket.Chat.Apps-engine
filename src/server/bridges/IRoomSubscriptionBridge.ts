import { IRoomSubscriptionIterator } from '../../definition/subscriptions';

export interface IRoomSubscriptionBridge {
    getByRoomId(roomId: string, appId: string): Promise<IRoomSubscriptionIterator>;

    getByUserId(userId: string, appId: string): Promise<IRoomSubscriptionIterator>;
}
