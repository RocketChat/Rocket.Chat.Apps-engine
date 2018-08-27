import { AsyncTest, Expect, SetupFixture, SpyOn } from 'alsatian';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '../../../src/definition/metadata';

import { Persistence } from '../../../src/server/accessors';
import { IPersistenceBridge } from '../../../src/server/bridges';

export class PersistenceAccessorTestFixture {
    private mockAppId: string;
    private mockPersisBridge: IPersistenceBridge;
    private mockAssoc: RocketChatAssociationRecord;
    private data: object;

    @SetupFixture
    public setupFixture() {
        this.mockAppId = 'testing-app';
        this.data = { hello: 'world' };

        const theData = this.data;
        this.mockPersisBridge = {
            create(data: any, appId: string): Promise<string> {
                return Promise.resolve('id');
            },
            createWithAssociations(data: any, assocs: Array<RocketChatAssociationRecord>, appId: string): Promise<string> {
                return Promise.resolve('id2');
            },
            update(id: string, data: object, upsert: boolean, appId: string): Promise<string> {
                return Promise.resolve('id3');
            },
            remove(id: string, appId: string): Promise<object> {
                return Promise.resolve(theData);
            },
            removeByAssociations(assocs: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>> {
                return Promise.resolve([theData]);
            },
        } as IPersistenceBridge;
        this.mockAssoc = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, 'fake-id');
    }

    @AsyncTest()
    public async usePersistenceAccessor() {
        Expect(() => new Persistence(this.mockPersisBridge, this.mockAppId)).not.toThrow();

        const sp1 = SpyOn(this.mockPersisBridge, 'create');
        const sp2 = SpyOn(this.mockPersisBridge, 'createWithAssociations');
        const sp3 = SpyOn(this.mockPersisBridge, 'update');
        const sp4 = SpyOn(this.mockPersisBridge, 'remove');
        const sp5 = SpyOn(this.mockPersisBridge, 'removeByAssociations');

        const ps = new Persistence(this.mockPersisBridge, this.mockAppId);

        Expect(await ps.create(this.data)).toBe('id');
        Expect(this.mockPersisBridge.create).toHaveBeenCalledWith(this.data, this.mockAppId);
        Expect(await ps.createWithAssociation(this.data, this.mockAssoc)).toBe('id2');
        Expect(await ps.createWithAssociations(this.data, [this.mockAssoc])).toBe('id2');
        Expect(this.mockPersisBridge.createWithAssociations).toHaveBeenCalled().exactly(2);
        Expect(await ps.update('id', this.data)).toBe('id3');
        Expect(this.mockPersisBridge.update).toHaveBeenCalledWith('id', this.data, false, this.mockAppId);
        Expect(await ps.remove('id')).toEqual(this.data);
        Expect(this.mockPersisBridge.remove).toHaveBeenCalledWith('id', this.mockAppId);
        Expect(await ps.removeByAssociation(this.mockAssoc)).toBeDefined();
        Expect(await ps.removeByAssociations([this.mockAssoc])).toBeDefined();
        Expect(this.mockPersisBridge.removeByAssociations).toHaveBeenCalled().exactly(2);

        sp1.restore();
        sp2.restore();
        sp3.restore();
        sp4.restore();
        sp5.restore();
    }
}
