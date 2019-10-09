import { IRoomSubscriptionRead } from '../../definition/accessors';
import { IRoomSubscription } from '../../definition/subscriptions';

import { IRoomSubscriptionBridge } from '../bridges';

export class RoomSubscriptionRead implements IRoomSubscriptionRead {
    constructor(private subscriptionBridge: IRoomSubscriptionBridge, private appId: string) { }

    public getByRoomId(roomId: string): Promise<IterableIterator<IRoomSubscription>> {
        return this.subscriptionBridge.getByRoomId(roomId, this.appId);
    }

    public getByUserId(userId: string): Promise<IterableIterator<IRoomSubscription>> {
        return this.subscriptionBridge.getByUserId(userId, this.appId);
    }
}
