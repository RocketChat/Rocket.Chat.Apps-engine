import { ICloudWorkspaceBridge } from '../../../src/server/bridges/ICloudWorkspaceBridge';

export class TestAppCloudWorkspaceBridge implements ICloudWorkspaceBridge {
    public async getWorkspaceToken(scope: string, appId: string): Promise<string> {
        return 'mock-workspace-token';
    }
}
