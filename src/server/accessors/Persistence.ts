import { IPersistence } from 'temporary-rocketlets-ts-definition/accessors';
import { RocketChatAssociationRecord } from 'temporary-rocketlets-ts-definition/metadata';

import { IPersistenceBridge } from '../bridges/IPersistenceBridge';

export class Persistence implements IPersistence {
    constructor(private persistBridge: IPersistenceBridge, private rocketletId: string) { }

    public create(data: any): string {
        return this.persistBridge.create(data, this.rocketletId);
    }

    public createWithAssociation(data: object, association: RocketChatAssociationRecord): string {
        return this.persistBridge.createWithAssociations(data, new Array(association), this.rocketletId);
    }

    public createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>): string {
        return this.persistBridge.createWithAssociations(data, associations, this.rocketletId);
    }

    public update(id: string, data: object, upsert = false): string {
        return this.persistBridge.update(id, data, upsert, this.rocketletId);
    }

    public remove(id: string): object {
        return this.persistBridge.remove(id, this.rocketletId);
    }

    public removeByAssociation(association: RocketChatAssociationRecord): number {
        return this.persistBridge.removeByAssociations(new Array(association), this.rocketletId);
    }

    public removeByAssociations(associations: Array<RocketChatAssociationRecord>): number {
        return this.persistBridge.removeByAssociations(associations, this.rocketletId);
    }
}
