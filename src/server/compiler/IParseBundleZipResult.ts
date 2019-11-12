import { IParseAppZipResult } from './IParseAppZipResult';

export interface IBundleZipAppEntry {
    appId: string;
    license: string;
    parseResult?: IParseAppZipResult;
    error?: string;
}

export interface IParseBundleZipResult {
    version: number;
    workspaceId: string;
    apps: Array<IBundleZipAppEntry>;
}
