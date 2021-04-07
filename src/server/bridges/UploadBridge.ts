import { IUpload } from '../../definition/uploads';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';
import { PermissionDeniedError } from '../errors/PermissionDeniedError';
import { AppPermissionManager } from '../managers/AppPermissionManager';
import { AppPermissions } from '../permissions/AppPermissions';
import { BaseBridge } from './BaseBridge';

export abstract class UploadBridge extends BaseBridge {
    public async doGetById(id: string, appId: string): Promise<IUpload> {
        this.checkReadPermission(appId);

        return this.getById(id, appId);
    }

    public async doGetBuffer(upload: IUpload, appId: string): Promise<Buffer> {
        this.checkReadPermission(appId);

        return this.getBuffer(upload, appId);
    }

    public async doCreateUpload(details: IUploadDetails, buffer: Buffer, appId: string): Promise<IUpload> {
        this.checkWritePermission(appId);

        return this.createUpload(details, buffer, appId);
    }

    protected abstract getById(id: string, appId: string): Promise<IUpload>;
    protected abstract getBuffer(upload: IUpload, appId: string): Promise<Buffer>;
    protected abstract createUpload(details: IUploadDetails, buffer: Buffer, appId: string): Promise<IUpload>;

    private checkWritePermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.upload.write)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.upload.write],
            });
        }
    }

    private checkReadPermission(appId: string) {
        if (!AppPermissionManager.hasPermission(appId, AppPermissions.upload.read)) {
            throw new PermissionDeniedError({
                appId,
                missingPermissions: [AppPermissions.upload.read],
            });
        }
    }
}
