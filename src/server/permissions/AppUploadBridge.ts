import { IPermission } from '../../definition/permission/AppPermission';
import { IUpload } from '../../definition/uploads';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';

export const UploadPermissions: { [permission: string]: IPermission } = {
    // getById, getBuffer
    'upload.read': {
        name: 'upload.read',
    },
    // createUpload
    'upload.write': {
        name: 'upload.write',
    },
};

export const AppUploadBridge = {
    getById(id: string, appId: string): void {
        return;
    },
    getBuffer(upload: IUpload, appId: string): void {
        return;
    },
    createUpload(details: IUploadDetails, buffer: Buffer, appId: string): void {
        return;
    },
};
