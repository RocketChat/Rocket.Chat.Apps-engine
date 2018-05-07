import { RocketChatAssociationRecord } from '@rocket.chat/apps-ts-definition/metadata';
import { AsyncTest, Expect, SetupFixture } from 'alsatian';

import { PersistenceRead } from '../../../src/server/accessors';
import { IPersistenceBridge } from '../../../src/server/bridges';

export class PersistenceReadTestFixture {
    private mockPersisBridge: IPersistenceBridge;

    @SetupFixture
    public setupFixture() {
        this.mockPersisBridge = {
            readById(id: string, appId: string): Promise<object> {
                return Promise.resolve({ id, appId });
            },
            readByAssociations(assocs: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>> {
                return Promise.resolve([{ appId }]);
            },
        } as IPersistenceBridge;
    }

    @AsyncTest()
    public async usePersistenceRead() {
        Expect(() => new PersistenceRead(this.mockPersisBridge, 'testing')).not.toThrow();

        const pr = new PersistenceRead(this.mockPersisBridge, 'testing');
        Expect(await pr.read('thing')).toBeDefined();
        Expect(await pr.readByAssociation({} as RocketChatAssociationRecord)).toBeDefined();
        Expect(await pr.readByAssociations([{} as RocketChatAssociationRecord])).toBeDefined();
    }
}
