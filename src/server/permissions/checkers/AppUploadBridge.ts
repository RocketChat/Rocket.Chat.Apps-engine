import { IUpload } from '../../../definition/uploads';
import { IUploadDetails } from '../../../definition/uploads/IUploadDetails';
import { PermissionDeniedError } from '../../errors/PermissionDeniedError';
import { AppPermissionManager } from '../../managers/AppPermissionManager';
import { AppPermissions } from '../AppPermissions';

export const AppUploadBridge = {
    hasReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.upload.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.upload.read],
            });
        }
    },
    hasWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.upload.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.upload.write],
            });
        }
    },
    getById(id: string, appId: string): void {
        return this.hasReadPermission(appId);
    },
    getBuffer(upload: IUpload, appId: string): void {
        return this.hasReadPermission(appId);
    },
    createUpload(details: IUploadDetails, buffer: Buffer, appId: string): void {
        return this.hasWritePermission(appId);
    },
};
