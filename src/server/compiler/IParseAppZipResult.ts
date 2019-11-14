import { IAppInfo } from '../../definition/metadata';
import { AppImplements } from './AppImplements';
import { ICompilerError } from './ICompilerError';

export interface IParseAppZipResult {
    info: IAppInfo;
    compiledFiles: { [key: string]: string };
    languageContent: { [key: string]: object };
    compilerErrors: Array<ICompilerError>;
    zipContentsBase64d: string;
    implemented?: AppImplements;
}
