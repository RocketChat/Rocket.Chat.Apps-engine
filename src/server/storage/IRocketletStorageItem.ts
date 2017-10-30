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
    languageContent: { [key: string]: object };
    settings: { [id: string]: ISetting };
}
