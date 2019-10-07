import { IPersistence } from '../../definition/accessors';
import { RocketChatAssociationRecord } from '../../definition/metadata';

import { IPersistenceBridge } from '../bridges/IPersistenceBridge';

export class Persistence implements IPersistence {
    constructor(private persistBridge: IPersistenceBridge, private appId: string) { }

    public create(data: object): Promise<string> {
        return this.persistBridge.create(data, this.appId);
    }

    public createWithAssociation(data: object, association: RocketChatAssociationRecord): Promise<string> {
        return this.persistBridge.createWithAssociations(data, new Array(association), this.appId);
    }

    public createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>): Promise<string> {
        return this.persistBridge.createWithAssociations(data, associations, this.appId);
    }

    public update(id: string, data: object, upsert = false): Promise<string> {
        return this.persistBridge.update(id, data, upsert, this.appId);
    }

    public updateByAssociation(association: RocketChatAssociationRecord, data: object, upsert = false): Promise<string> {
        return this.persistBridge.updateByAssociations(new Array(association), data, upsert, this.appId);
    }

    public updateByAssociations(associations: Array<RocketChatAssociationRecord>, data: object, upsert = false): Promise<string> {
        return this.persistBridge.updateByAssociations(associations, data, upsert, this.appId);
    }

    public remove(id: string): Promise<object> {
        return this.persistBridge.remove(id, this.appId);
    }

    public removeByAssociation(association: RocketChatAssociationRecord): Promise<Array<object>> {
        return this.persistBridge.removeByAssociations(new Array(association), this.appId);
    }

    public removeByAssociations(associations: Array<RocketChatAssociationRecord>): Promise<Array<object>> {
        return this.persistBridge.removeByAssociations(associations, this.appId);
    }
}
