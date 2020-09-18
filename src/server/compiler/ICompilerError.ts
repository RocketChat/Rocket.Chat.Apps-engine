export interface ICompilerError {
    file: string;
    line: number;
    character: number;
    message: string;
}
