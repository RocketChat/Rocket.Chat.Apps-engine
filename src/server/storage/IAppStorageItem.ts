import { AppStatus } from '@rocket.chat/apps-ts-definition/AppStatus';
import { IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

export interface IAppStorageItem {
    _id?: string;
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    status: AppStatus;
    info: IAppInfo;
    zip: string;
    compiled: { [s: string]: string };
    languageContent: { [key: string]: object };
    settings: { [id: string]: ISetting };
}
