import * as FileType from 'file-type';
import * as MIME from 'mime-types';

import { IUploadCreator } from '../../definition/accessors';
import { IRoom } from '../../definition/rooms';
import { IUpload } from '../../definition/uploads';
import { IUploadDetails } from '../../definition/uploads/IUploadDetails';
import { AppBridges } from '../bridges';

export class UploadCreator implements IUploadCreator {
    constructor(
        private readonly bridges: AppBridges,
        private readonly appId: string,
    ) { }

    public async createUpload(room: IRoom, filename: string, buffer: Buffer): Promise<IUpload> {
        const appUser = await this.bridges.getUserBridge().getAppUser(this.appId);

        if (!appUser) {
            throw new Error('Failed to obtain the app user to perform the upload');
        }

        if (filename.split('.').length < 2) {
            throw new Error('The upload filename without extension is not allowed. ' +
                'Please check the filename of your upload!');
        }

        const detectedFileType = await FileType.fromBuffer(buffer);
        const ext = filename.split('.').pop();

        let mime = MIME.lookup(ext) || '';
        if (detectedFileType) {
            if (!filename.endsWith(detectedFileType.ext)) {
                throw new Error('It seems that the actual extension name of this upload is ' +
                `"${ detectedFileType.ext }", but what you provided is "${ ext }".`);
            }
            mime = detectedFileType.mime;
        }

        const details = {
            name: filename,
            size: buffer.length,
            type: mime,
            rid: room.id,
            userId: appUser.id,
        } as IUploadDetails;

        return this.bridges.getUploadBridge().createUpload(details, buffer, this.appId);
    }
}
