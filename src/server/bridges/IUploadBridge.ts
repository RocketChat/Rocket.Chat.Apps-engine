import { IUpload } from '../../definition/uploads';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';

export interface IUploadBridge {
    doGetById(id: string, appId: string): Promise<IUpload>;
    doGetBuffer(upload: IUpload, appId: string): Promise<Buffer>;
    doCreateUpload(details: IUploadDetails, buffer: Buffer, appId: string): Promise<IUpload>;
}
