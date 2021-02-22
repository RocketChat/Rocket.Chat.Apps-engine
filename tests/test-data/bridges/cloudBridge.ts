import { IWorkspaceToken } from '../../../src/definition/cloud/IWorkspaceToken';
import { ICloudWorkspaceBridge } from '../../../src/server/bridges/ICloudWorkspaceBridge';

export class TestAppCloudWorkspaceBridge implements ICloudWorkspaceBridge {
    public async getWorkspaceToken(scope: string, appId: string): Promise<IWorkspaceToken> {
        return {
            token: 'mock-workspace-token',
            expiresAt: new Date(Date.now() + 10000),
        };
    }
}
