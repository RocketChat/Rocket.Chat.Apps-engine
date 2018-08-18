import { AppCompiler } from './AppCompiler';
import { IParseZipResult } from './IParseZipResult';
export declare class AppPackageParser {
    static uuid4Regex: RegExp;
    private allowedIconExts;
    private appsTsDefVer;
    constructor();
    parseZip(compiler: AppCompiler, zipBase64: string): Promise<IParseZipResult>;
    private getLanguageContent(zip);
    private getIconFile(zip, filePath);
    private getTsDefVersion();
}
