import { AppInstallationMethod } from '../AppInstallationMethod';
import { IPermission } from '../permissions/IPermission';
import { AppInterface } from './AppInterface';
import { IAppAuthorInfo } from './IAppAuthorInfo';

export interface IAppInfo {
    id: string;
    name: string;
    nameSlug: string;
    installationMethod?: AppInstallationMethod;
    version: string;
    description: string;
    requiredApiVersion: string;
    author: IAppAuthorInfo;
    classFile: string;
    iconFile: string;
    implements: Array<AppInterface>;
    /** Base64 string of the App's icon. */
    iconFileContent?: string;
    essentials?: Array<AppInterface>;
    permissions: Array<IPermission>;
}
