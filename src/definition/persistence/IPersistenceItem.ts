import { RocketChatAssociationRecord } from '../../definition/metadata';

export interface IPersistenceItem {
    appId: string;
    data: Record<string, unknown>;
    associations?: Array<RocketChatAssociationRecord>;
}
