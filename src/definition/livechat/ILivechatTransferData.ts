import { IUser } from '../users';
import { ILivechatRoom } from './ILivechatRoom';

export interface ILivechatTransferData {
    currentRoom: ILivechatRoom;
    targetAgent?: IUser;
    targetDepartment?: string;
}
