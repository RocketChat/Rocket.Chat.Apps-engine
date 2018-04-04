import { AppImplements } from './AppImplements';
import { ICompilerFile } from './ICompilerFile';

export interface ICompilerResult {
    files: { [s: string]: ICompilerFile };
    implemented: AppImplements;
}
