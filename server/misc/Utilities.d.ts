import { ICompilerFile } from '../compiler';
export declare class Utilities {
    static deepClone<T>(item: T): T;
    static deepFreeze<T>(item: any): T;
    static deepCloneAndFreeze<T>(item: T): T;
    static transformModuleForCustomRequire(moduleName: string): string;
    static buildCustomRequire(files: {
        [s: string]: ICompilerFile;
    }): (mod: string) => {};
}
