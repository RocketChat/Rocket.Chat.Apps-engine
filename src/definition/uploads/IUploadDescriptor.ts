import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface IUploadDescriptor {
    /**
     * Full filename of the file, including extension name
     */
    filename: string;
    /**
     * The room where the file to be uploaded
     */
    room: IRoom;
    /**
     * The user that performed the upload
     *
     * NOTE: please ignore this property if you are going
     * to assign a livechat visitor to perform upload.
     */
    user?: IUser | null;
    /**
     * The token of a Livechat visitor
     */
    visitorToken?: string;
}
