import { RocketChatAssociationRecord } from '../../definition/metadata';

export interface IPersistenceItem {
    _id: string;
    appId: string;
    data: Record<string, unknown>;
    associations?: Array<RocketChatAssociationRecord>;
}
