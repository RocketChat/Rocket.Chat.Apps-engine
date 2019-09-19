import { IAppInfo } from '../../definition/metadata';
import { AppImplements } from './AppImplements';
import { ICompilerError } from './ICompilerError';
import { InstallZipType } from './InstallZipType';

export interface IParseAppZipResult {
    type: InstallZipType.APP;
    info: IAppInfo;
    compiledFiles: { [key: string]: string };
    languageContent: { [key: string]: object };
    implemented: AppImplements;
    compilerErrors: Array<ICompilerError>;
}
