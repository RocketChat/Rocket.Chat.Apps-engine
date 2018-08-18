import { IPersistenceRead } from '../../definition/accessors';
import { RocketChatAssociationRecord } from '../../definition/metadata';
import { IPersistenceBridge } from '../bridges';
export declare class PersistenceRead implements IPersistenceRead {
    private persistBridge;
    private appId;
    constructor(persistBridge: IPersistenceBridge, appId: string);
    read(id: string): Promise<object>;
    readByAssociation(association: RocketChatAssociationRecord): Promise<Array<object>>;
    readByAssociations(associations: Array<RocketChatAssociationRecord>): Promise<Array<object>>;
}
