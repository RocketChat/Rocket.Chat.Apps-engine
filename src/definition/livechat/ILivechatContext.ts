import { IUser } from '../users';
import { ILivechatRoom } from './ILivechatRoom';

export interface ILivechatContext {
    agent: IUser;
    room: ILivechatRoom;
}
