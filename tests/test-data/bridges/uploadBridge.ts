import { IUpload } from '../../../src/definition/uploads';
import { IUploadDetails } from '../../../src/definition/uploads/IUploadDetails';
import { IUploadBridge } from '../../../src/server/bridges/IUploadBridge';

export class TestUploadBridge implements IUploadBridge {
    public getById(id: string, appId: string): Promise<IUpload> {
        throw new Error('Method not implemented');
    }
    public getBuffer(upload: IUpload, appId: string): Promise<Buffer> {
        throw new Error('Method not implemented');
    }

    public createUpload(details: IUploadDetails, buffer: Buffer, appId: string): Promise<IUpload> {
        throw new Error('Method not implemented');
    }
}
