import { IRocketletInfo } from 'temporary-rocketlets-ts-definition/metadata';

export interface IRocketletStorageItem {
    id: string;
    info: IRocketletInfo;
    zip: string;
    compiled: string;
}
