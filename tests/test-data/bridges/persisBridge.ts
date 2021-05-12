import { RocketChatAssociationRecord } from '../../../src/definition/metadata';

import { PersistenceBridge } from '../../../src/server/bridges';

export class TestsPersisBridge {
    public doPurge(appId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public doCreate(data: any, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doCreateWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doReadById(id: string, appId: string): Promise<object> {
        throw new Error('Method not implemented.');
    }

    public doReadByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>> {
        throw new Error('Method not implemented.');
    }

    public doRemove(id: string, appId: string): Promise<object> {
        throw new Error('Method not implemented.');
    }

    public doRemoveByAssociations(associations: Array<RocketChatAssociationRecord>, appId: string): Promise<Array<object>> {
        throw new Error('Method not implemented.');
    }

    public doUpdate(id: string, data: object, upsert: boolean, appId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public doUpdateByAssociations(associations: Array<RocketChatAssociationRecord>, data: object, upsert: boolean, appId: string): Promise<string> {
        throw new Error('Method not implemented');
    }
}
