import { IAppInfo } from '../../definition/metadata';
import { AppImplements } from './AppImplements';

export interface IParseAppPackageResult {
    info: IAppInfo;
    files: { [key: string]: string };
    languageContent: { [key: string]: object };
    implemented: AppImplements;
}
