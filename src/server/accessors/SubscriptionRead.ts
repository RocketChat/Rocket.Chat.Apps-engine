import { ISubscriptionRead } from '@rocket.chat/apps-ts-definition/accessors';
import { ISubscription } from '@rocket.chat/apps-ts-definition/subscriptions';

import { ISubscriptionBridge } from '../bridges';

export class SubscriptionRead implements ISubscriptionRead {
    constructor(private subscriptionBridge: ISubscriptionBridge, private appId: string) { }

    public getByRoomId(roomId: string): Promise<ISubscription> {
        return this.subscriptionBridge.getByRoomId(roomId, this.appId);
    }

}
