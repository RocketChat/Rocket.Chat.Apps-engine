import { IRoom } from '../rooms';
import { IUpload } from '../uploads';

export interface IUploadCreator {
    /**
     * Create an upload to a room
     *
     * @param room The room which to upload the file to
     * @param filename Full filename of the upload, including extension name
     * @param buffer The file buffer to be uploaded (See [here](https://nodejs.org/api/buffer.html)
     * for more details about Buffer)
     */
    createUpload(room: IRoom, filename: string, buffer: Buffer): Promise<IUpload>;
}
