import { IParseAppZipResult } from './IParseAppZipResult';
import { IParseBundleZipResult } from './IParseBundleZipResult';

export enum ZipContentType {
    APP = 'app',
    BUNDLE = 'bundle',
}

export interface IParseZipResult {
    contentType: ZipContentType;
    parsed: IParseAppZipResult | IParseBundleZipResult;
}
