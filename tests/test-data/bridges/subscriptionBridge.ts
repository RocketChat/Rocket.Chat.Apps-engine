import { IRoomSubscription } from '../../../src/definition/subscriptions';
import { IRoomSubscriptionBridge } from '../../../src/server/bridges';

export class TestsSubscriptionBridge implements IRoomSubscriptionBridge {
    public getByRoomId(roomId: string, appId: string): Promise<AsyncIterableIterator<IRoomSubscription>> {
        throw new Error('Method not implemented.');
    }

    public getByUserId(userId: string, appId: string): Promise<AsyncIterableIterator<IRoomSubscription>> {
        throw new Error('Method not implemented.');
    }
}
