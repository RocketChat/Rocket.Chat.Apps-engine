import { AppImplements } from './AppImplements';
import { ICompilerError } from './ICompilerError';
import { ICompilerFile } from './ICompilerFile';
export interface ICompilerResult {
    files: {
        [s: string]: ICompilerFile;
    };
    implemented: AppImplements;
    compilerErrors: Array<ICompilerError>;
}
