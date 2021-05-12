import { IUpload } from '../../../src/definition/uploads';
import { IUploadDetails } from '../../../src/definition/uploads/IUploadDetails';
import { UploadBridge } from '../../../src/server/bridges/UploadBridge';

export class TestUploadBridge {
    public doGetById(id: string, appId: string): Promise<IUpload> {
        throw new Error('Method not implemented');
    }
    public doGetBuffer(upload: IUpload, appId: string): Promise<Buffer> {
        throw new Error('Method not implemented');
    }

    public doCreateUpload(details: IUploadDetails, buffer: Buffer, appId: string): Promise<IUpload> {
        throw new Error('Method not implemented');
    }
}
