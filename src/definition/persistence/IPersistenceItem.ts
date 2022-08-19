import { RocketChatAssociationRecord } from '../../definition/metadata';

export interface IPersistenceItem {
    appId: string;
    data: { [key: string]: object };
    associations?: Array<RocketChatAssociationRecord>;
}
