import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';
import { IWorkspaceToken } from '../../definition/cloud/IWorkspaceToken';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';

export abstract class CloudWorkspaceBridge extends BaseBridge {
    public doGetWorkspaceToken(scope: string, appId: string): Promise<IWorkspaceToken> {
        if (this.hasCloudTokenPermission(appId)) {
            return this.getWorkspaceToken(scope, appId);
        }
    }

    protected abstract getWorkspaceToken(scope: string, appId: string): Promise<IWorkspaceToken>;
    
    private hasCloudTokenPermission(appId: string): boolean {
        if (AppPermissionManager.hasPermission(appId, AppPermissions.cloud['workspace-token'])) {
            return true;
        }

        AppPermissionManager.notifyAboutError(new PermissionDeniedError({
            appId,
            missingPermissions: [AppPermissions.cloud['workspace-token']],
        }));

        return false;
    }
}
