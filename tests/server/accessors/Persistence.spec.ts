import { RocketChatAssociationModel, RocketChatAssociationRecord } from '../../../src/definition/metadata';

import { Persistence } from '../../../src/server/accessors';
import { IPersistenceBridge } from '../../../src/server/bridges';

let mockAppId: string;
let mockPersisBridge: IPersistenceBridge;
let mockAssoc: RocketChatAssociationRecord;
const data: object = null;

beforeAll(() =>  {
    mockAppId = 'testing-app';

    const theData = data;
    mockPersisBridge = {
        create(dat: any, appId: string): Promise<string> {
            return Promise.resolve('id');
        },
        createWithAssociations(dat: any, assocs: Array<RocketChatAssociationRecord>, appId: string): Promise<string> {
            return Promise.resolve('id2');
        },
        update(id: string, dat: object, upsert: boolean, appId: string): Promise<string> {
            return Promise.resolve('id3');
        },
        remove(id: string, appId: string): Promise<object> {
            return Promise.resolve(theData);
        },
        removeByAssociations(assocs: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>> {
            return Promise.resolve([theData]);
        },
        updateByAssociations(associations: Array<RocketChatAssociationRecord>, dat: object, upsert: boolean, appId: string): Promise<string> {
            return Promise.resolve('id4');
        },
    } as IPersistenceBridge;
    mockAssoc = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, 'fake-id');
});

test('usePersistenceAccessor', async () => {
    expect(() => new Persistence(mockPersisBridge, mockAppId)).not.toThrow();

    const sp1 = jest.spyOn(mockPersisBridge, 'create');
    const sp2 = jest.spyOn(mockPersisBridge, 'createWithAssociations');
    const sp3 = jest.spyOn(mockPersisBridge, 'update');
    const sp4 = jest.spyOn(mockPersisBridge, 'remove');
    const sp5 = jest.spyOn(mockPersisBridge, 'removeByAssociations');
    const sp6 = jest.spyOn(mockPersisBridge, 'updateByAssociations');

    const ps = new Persistence(mockPersisBridge, mockAppId);

    expect(await ps.create(data)).toBe('id');
    expect(mockPersisBridge.create).toHaveBeenCalledWith(data, mockAppId);
    expect(await ps.createWithAssociation(data, mockAssoc)).toBe('id2');
    expect(await ps.createWithAssociations(data, [mockAssoc])).toBe('id2');
    expect(mockPersisBridge.createWithAssociations).toHaveBeenCalledTimes(2);
    expect(await ps.update('id', data)).toBe('id3');
    expect(mockPersisBridge.update).toHaveBeenCalledWith('id', data, false, mockAppId);
    expect(await ps.remove('id')).toEqual(data);
    expect(mockPersisBridge.remove).toHaveBeenCalledWith('id', mockAppId);
    expect(await ps.removeByAssociation(mockAssoc)).toBeDefined();
    expect(await ps.removeByAssociations([mockAssoc])).toBeDefined();
    expect(mockPersisBridge.removeByAssociations).toHaveBeenCalledTimes(2);

    expect(await ps.updateByAssociation(mockAssoc, data)).toBeDefined();
    expect(await ps.updateByAssociations([mockAssoc], data)).toBeDefined();
    expect(mockPersisBridge.updateByAssociations).toHaveBeenCalledTimes(2);

    sp1.mockClear();
    sp2.mockClear();
    sp3.mockClear();
    sp4.mockClear();
    sp5.mockClear();
    sp6.mockClear();
});
