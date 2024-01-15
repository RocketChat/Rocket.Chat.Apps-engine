import type { IUploadCreator } from '../../definition/accessors';
import type { IUpload } from '../../definition/uploads';
import type { IUploadDescriptor } from '../../definition/uploads/IUploadDescriptor';
import type { IUploadDetails } from '../../definition/uploads/IUploadDetails';
import type { AppBridges } from '../bridges';

export class UploadCreator implements IUploadCreator {
    constructor(private readonly bridges: AppBridges, private readonly appId: string) {}

    public async uploadBuffer(buffer: Buffer, descriptor: IUploadDescriptor): Promise<IUpload> {
        // We need to convert to buffer since Deno sends Uint8Array
        const buff = Buffer.from(buffer);

        if (!descriptor.hasOwnProperty('user') && !descriptor.visitorToken) {
            descriptor.user = await this.bridges.getUserBridge().doGetAppUser(this.appId);
        }

        const details = {
            name: descriptor.filename,
            size: buff.length,
            rid: descriptor.room.id,
            userId: descriptor.user?.id,
            visitorToken: descriptor.visitorToken,
        } as IUploadDetails;

        return this.bridges.getUploadBridge().doCreateUpload(details, buff, this.appId);
    }
}
