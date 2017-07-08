import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export interface IRocketletStorageItem {
    _id?: string;
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    info: IRocketletInfo;
    zip: string;
    compiled: { [s: string]: string };
    settings: { [id: string]: ISetting };
}
