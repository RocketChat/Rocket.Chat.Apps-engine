import { ICloudWorkspaceRead } from '../../definition/accessors/ICloudWorkspaceRead';
import { IWorkspaceToken } from '../../definition/cloud/IWorkspaceToken';
import { ICloudWorkspaceBridge } from '../bridges/ICloudWorkspaceBridge';

export class CloudWorkspaceRead implements ICloudWorkspaceRead {
    constructor(private readonly cloudBridge: ICloudWorkspaceBridge, private readonly appId: string) { }
    public async getWorkspaceToken(scope: string): Promise<IWorkspaceToken> {
        return this.cloudBridge.getWorkspaceToken(scope, this.appId);
    }
}
