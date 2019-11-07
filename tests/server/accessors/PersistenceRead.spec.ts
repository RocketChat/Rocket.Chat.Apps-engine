import { RocketChatAssociationRecord } from '../../../src/definition/metadata';

import { PersistenceRead } from '../../../src/server/accessors';
import { IPersistenceBridge } from '../../../src/server/bridges';

let mockPersisBridge: IPersistenceBridge;

beforeAll(() =>  {
    mockPersisBridge = {
        readById(id: string, appId: string): Promise<object> {
            return Promise.resolve({ id, appId });
        },
        readByAssociations(assocs: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>> {
            return Promise.resolve([{ appId }]);
        },
    } as IPersistenceBridge;
});

test('usePersistenceRead', async () => {
    expect(() => new PersistenceRead(mockPersisBridge, 'testing')).not.toThrow();

    const pr = new PersistenceRead(mockPersisBridge, 'testing');
    expect(await pr.read('thing')).toBeDefined();
    expect(await pr.readByAssociation({} as RocketChatAssociationRecord)).toBeDefined();
    expect(await pr.readByAssociations([{} as RocketChatAssociationRecord])).toBeDefined();
});
