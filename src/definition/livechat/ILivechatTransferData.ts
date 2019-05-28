import { IRoom } from '../rooms';
import { IUser } from '../users';

export interface ILivechatTransferData {
    currentRoom: IRoom;
    targetAgent?: IUser;
    targetDepartment?: string;
}
