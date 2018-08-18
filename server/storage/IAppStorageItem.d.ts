import { AppStatus } from '../../definition/AppStatus';
import { IAppInfo } from '../../definition/metadata';
import { ISetting } from '../../definition/settings';
export interface IAppStorageItem {
    _id?: string;
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    status: AppStatus;
    info: IAppInfo;
    zip: string;
    compiled: {
        [s: string]: string;
    };
    languageContent: {
        [key: string]: object;
    };
    settings: {
        [id: string]: ISetting;
    };
    implemented: {
        [int: string]: boolean;
    };
}
