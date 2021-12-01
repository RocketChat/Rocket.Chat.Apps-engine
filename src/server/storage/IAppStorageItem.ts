import { AppStatus } from '../../definition/AppStatus';
import { IAppInfo } from '../../definition/metadata';
import { IPermission } from '../../definition/permissions/IPermission';
import { ISetting } from '../../definition/settings';
import { IMarketplaceInfo } from '../marketplace';

export interface IAppStorageItem {
    _id?: string;
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    status: AppStatus;
    info: IAppInfo;
    /**
     * The path that represents where the source of the app storaged.
     */
    sourcePath?: string;
    languageContent: { [key: string]: object };
    settings: { [id: string]: ISetting };
    implemented: { [int: string]: boolean };
    marketplaceInfo?: IMarketplaceInfo;
    permissionsGranted?: Array<IPermission>;
}
