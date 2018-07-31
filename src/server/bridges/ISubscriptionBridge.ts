import { ISubscription } from '@rocket.chat/apps-ts-definition/subscriptions';

export interface ISubscriptionBridge {
    getByRoomId(roomId: string, appId: string): Promise<ISubscription>;
}
