import { IPersistenceRead } from '../../definition/accessors';
import { RocketChatAssociationRecord } from '../../definition/metadata';
import { IPersistenceBridge } from '../bridges';

export class PersistenceRead implements IPersistenceRead {
    constructor(private persistBridge: IPersistenceBridge, private appId: string) { }

    public read(id: string): Promise<object> {
        return this.persistBridge.doReadById(id, this.appId);
    }

    public readByAssociation(association: RocketChatAssociationRecord): Promise<Array<object>> {
        return this.persistBridge.doReadByAssociations(new Array(association), this.appId);
    }

    public readByAssociations(associations: Array<RocketChatAssociationRecord>): Promise<Array<object>> {
        return this.persistBridge.doReadByAssociations(associations, this.appId);
    }
}
