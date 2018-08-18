import { IPersistence } from '../../definition/accessors';
import { RocketChatAssociationRecord } from '../../definition/metadata';
import { IPersistenceBridge } from '../bridges/IPersistenceBridge';
export declare class Persistence implements IPersistence {
    private persistBridge;
    private appId;
    constructor(persistBridge: IPersistenceBridge, appId: string);
    create(data: object): Promise<string>;
    createWithAssociation(data: object, association: RocketChatAssociationRecord): Promise<string>;
    createWithAssociations(data: object, associations: Array<RocketChatAssociationRecord>): Promise<string>;
    update(id: string, data: object, upsert?: boolean): Promise<string>;
    remove(id: string): Promise<object>;
    removeByAssociation(association: RocketChatAssociationRecord): Promise<Array<object>>;
    removeByAssociations(associations: Array<RocketChatAssociationRecord>): Promise<Array<object>>;
}
