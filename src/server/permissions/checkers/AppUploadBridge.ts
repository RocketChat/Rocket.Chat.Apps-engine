import { IUpload } from '../../../definition/uploads';
import { IUploadDetails } from '../../../definition/uploads/IUploadDetails';

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
