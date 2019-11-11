import { InstallZipType } from './InstallZipType';
import { IParseAppZipResult } from './IParseAppZipResult';

export interface IParseBundleZipResult {
    type: InstallZipType.BUNDLE;
    info: object;
    apps: Array<IParseAppZipResult>;
}
