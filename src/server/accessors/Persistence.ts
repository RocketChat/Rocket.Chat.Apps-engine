import { IPersistence } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketChatAssociationRecord } from 'temporary-rocketlets-ts-definition/metadata';

import { IPersistenceBridge } from '../bridges/IPersistenceBridge';

export class Persistence implements IPersistence {
    constructor(private persistBridge: IPersistenceBridge, private rocketletId: string) { }

    public create(data: any): string {
        return this.persistBridge.create(data, this.rocketletId);
    }

    public createWithAssociation(data: object, association: RocketChatAssociationRecord): string {
        throw new Error('Method not implemented.');
    }

    public createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>): string {
        throw new Error('Method not implemented.');
    }

    public update(id: string, data: object, upsert?: boolean): string {
        throw new Error('Method not implemented.');
    }

    public remove(id: string): object {
        throw new Error('Method not implemented.');
    }

    public removeByAssociation(association: RocketChatAssociationRecord): Array<object> {
        throw new Error('Method not implemented.');
    }

    public removeByAssociations(associations: Array<RocketChatAssociationRecord>): Array<object> {
        throw new Error('Method not implemented.');
    }
}
