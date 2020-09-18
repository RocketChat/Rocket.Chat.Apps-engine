import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface IUploadDescriptor {
    filename: string;
    room: IRoom;
    user?: IUser | null;
}
