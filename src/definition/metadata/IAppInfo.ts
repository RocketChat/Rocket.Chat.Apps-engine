import { IAppAuthorInfo } from './IAppAuthorInfo';

export interface IAppInfo {
    id: string;
    name: string;
    nameSlug: string;
    version: string;
    description: string;
    requiredApiVersion: string;
    author: IAppAuthorInfo;
    classFile: string;
    iconFile: string;
    /** Base64 string of the App's icon. */
    iconFileContent?: string;
}
