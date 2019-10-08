import { ISubscriptionRead } from '../../definition/accessors';
import { ISubscription } from '../../definition/subscriptions';

import { ISubscriptionBridge } from '../bridges';

export class SubscriptionRead implements ISubscriptionRead {
    constructor(private subscriptionBridge: ISubscriptionBridge, private appId: string) { }

    public getByRoomId(roomId: string): Promise<IterableIterator<ISubscription>> {
        return this.subscriptionBridge.getByRoomId(roomId, this.appId);
    }
}
