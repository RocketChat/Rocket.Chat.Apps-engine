import { IPersistenceRead } from '@rocket.chat/apps-ts-definition/accessors';
import { RocketChatAssociationRecord } from '@rocket.chat/apps-ts-definition/metadata';
import { IPersistenceBridge } from '../bridges';

export class PersistenceRead implements IPersistenceRead {
    constructor(private persistBridge: IPersistenceBridge, private appId: string) { }

    public read(id: string): object {
        return this.persistBridge.readById(id, this.appId);
    }

    public readByAssociation(association: RocketChatAssociationRecord): Array<object> {
        return this.persistBridge.readByAssociations(new Array(association), this.appId);
    }

    public readByAssociations(associations: Array<RocketChatAssociationRecord>): Array<object> {
        return this.persistBridge.readByAssociations(associations, this.appId);
    }
}
