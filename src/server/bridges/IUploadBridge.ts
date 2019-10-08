import { IUpload } from '../../definition/uploads';

export interface IUploadBridge {
    getById(id: string, appId: string): Promise<IUpload>;
    getBuffer(upload: IUpload, appId: string): Promise<Buffer>;
}
