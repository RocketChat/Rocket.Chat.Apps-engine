import { IUpload } from '../../definition/uploads';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';

export interface IUploadBridge {
    name: string;
    getById(id: string, appId: string): Promise<IUpload>;
    getBuffer(upload: IUpload, appId: string): Promise<Buffer>;
    createUpload(details: IUploadDetails, buffer: Buffer, appId: string): Promise<IUpload>;
}
