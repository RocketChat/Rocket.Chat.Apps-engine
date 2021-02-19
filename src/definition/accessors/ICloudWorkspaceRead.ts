export interface ICloudWorkspaceRead {
    getWorkspaceToken(scope: string): Promise<string>;
}
