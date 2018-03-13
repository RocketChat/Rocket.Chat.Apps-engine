import { IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';
import { AppImplements } from './AppImplements';

export interface IParseZipResult {
    info: IAppInfo;
    compiledFiles: { [key: string]: string };
    languageContent: { [key: string]: object };
    implemented: AppImplements;
}
