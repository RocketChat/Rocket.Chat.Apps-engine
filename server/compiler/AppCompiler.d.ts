import { AppManager } from '../AppManager';
import { ProxiedApp } from '../ProxiedApp';
import { IAppStorageItem } from '../storage/IAppStorageItem';
import { ICompilerFile } from './ICompilerFile';
import { ICompilerResult } from './ICompilerResult';
import { IAppInfo } from '../../definition/metadata';
export declare class AppCompiler {
    private readonly compilerOptions;
    private libraryFiles;
    constructor();
    storageFilesToCompiler(files: {
        [key: string]: string;
    }): {
        [key: string]: ICompilerFile;
    };
    getLibraryFile(fileName: string): ICompilerFile;
    /**
     * Attempts to compile the TypeScript down into JavaScript which we can understand.
     * It returns the files, what the App implements, and whether there are errors or not.
     *
     * @param info the App's information (name, version, etc)
     * @param theFiles the actual files to try and compile
     * @returns the results of trying to compile, including errors
     */
    toJs(info: IAppInfo, theFiles: {
        [s: string]: ICompilerFile;
    }): ICompilerResult;
    toSandBox(manager: AppManager, storage: IAppStorageItem): ProxiedApp;
    private isValidFile(file);
}
