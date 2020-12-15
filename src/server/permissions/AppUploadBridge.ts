import { IPermission } from '../../definition/permission/IPermission';
import { IUpload } from '../../definition/uploads';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';

export const UploadPermissions: { [permission: string]: IPermission } = {
    // getById, getBuffer
    read: {
        name: 'upload.read',
    },
    // createUpload
    write: {
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
