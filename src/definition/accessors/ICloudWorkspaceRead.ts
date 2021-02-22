import { IWorkspaceToken } from '../cloud/IWorkspaceToken';

export interface ICloudWorkspaceRead {
    getWorkspaceToken(scope: string): Promise<IWorkspaceToken>;
}
