export interface IBundleManifest {
    version: number;
    workspaceId: string;
    apps: Array<{
        appId: string;
        license: string;
        filename: string;
    }>;
}
