
import { IUploadRead } from '../../definition/accessors';
import { IUpload } from '../../definition/uploads';
import { IUploadBridge } from '../bridges/IUploadBridge';

export class UploadRead implements IUploadRead {
    constructor(private readonly uploadBridge: IUploadBridge, private readonly appId: string) { }

    public getById(id: string): Promise<IUpload> {
        return this.uploadBridge.getById(id, this.appId);
    }

    public getBuffer(upload: IUpload): Promise<Buffer> {
        return this.uploadBridge.getBuffer(upload, this.appId);
    }

    public async getBufferById(id: string): Promise<Buffer> {
        const upload = await this.uploadBridge.getById(id, this.appId);

        return this.uploadBridge.getBuffer(upload, this.appId);
    }
}
