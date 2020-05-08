import { IRoomSubscriptionRead } from '../../definition/accessors';
import { IRoomSubscriptionIterator } from '../../definition/subscriptions';

import { IRoomSubscriptionBridge } from '../bridges';

export class RoomSubscriptionRead implements IRoomSubscriptionRead {
    constructor(private subscriptionBridge: IRoomSubscriptionBridge, private appId: string) { }

    public getByRoomId(roomId: string): Promise<IRoomSubscriptionIterator> {
        return this.subscriptionBridge.getByRoomId(roomId, this.appId);
    }

    public getByUserId(userId: string): Promise<IRoomSubscriptionIterator> {
        return this.subscriptionBridge.getByUserId(userId, this.appId);
    }
}
