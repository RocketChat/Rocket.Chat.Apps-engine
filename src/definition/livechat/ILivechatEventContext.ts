import { IUser } from '../users';
import { ILivechatRoom } from './ILivechatRoom';

export interface ILivechatEventContext {
    agent: IUser;
    room: ILivechatRoom;
}
