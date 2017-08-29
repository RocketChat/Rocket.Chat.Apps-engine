import { IPersistenceRead } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketChatAssociationRecord } from 'temporary-rocketlets-ts-definition/metadata';
import { IPersistenceBridge } from '../bridges';

export class PersistenceRead implements IPersistenceRead {
    constructor(private persistBridge: IPersistenceBridge, private rocketletId: string) { }

    public read(id: string): object {
        return this.persistBridge.readById(id, this.rocketletId);
    }

    public readByAssociation(association: RocketChatAssociationRecord): Array<object> {
        throw new Error('Method not implemented.');
    }

    public readByAssociations(associations: Array<RocketChatAssociationRecord>): Array<object> {
        throw new Error('Method not implemented.');
    }
}
