
export interface ICloudWorkspaceBridge {
    getWorkspaceToken(scope: string, appId: string): Promise<string>;
}
