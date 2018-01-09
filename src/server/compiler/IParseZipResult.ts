import { IAppInfo } from '@rocket.chat/apps-ts-definition/metadata';

export interface IParseZipResult {
    info: IAppInfo;
    compiledFiles: { [key: string]: string };
    languageContent: { [key: string]: object };
}
