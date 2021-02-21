import { IWorkspaceToken } from '../../definition/cloud/IWorkspaceToken';

export interface ICloudWorkspaceBridge {
    getWorkspaceToken(scope: string, appId: string): Promise<IWorkspaceToken>;
}
