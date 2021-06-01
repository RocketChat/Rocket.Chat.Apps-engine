import { IWorkspaceToken } from '../../definition/cloud/IWorkspaceToken';

export interface ICloudWorkspaceBridge {
    doGetWorkspaceToken(scope: string, appId: string): Promise<IWorkspaceToken>;
}
