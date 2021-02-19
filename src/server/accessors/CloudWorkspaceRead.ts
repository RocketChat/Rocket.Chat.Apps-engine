import { ICloudWorkspaceRead } from '../../definition/accessors/ICloudWorkspaceRead';
import { ICloudWorkspaceBridge } from '../bridges/ICloudWorkspaceBridge';

export class CloudWorkspaceRead implements ICloudWorkspaceRead {
    constructor(private readonly cloudBridge: ICloudWorkspaceBridge, private readonly appId: string) { }
    public async getWorkspaceToken(scope: string): Promise<string> {
        return this.cloudBridge.getWorkspaceToken(scope, this.appId);
    }
}
