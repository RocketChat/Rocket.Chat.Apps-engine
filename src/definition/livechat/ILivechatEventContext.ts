import { IUser } from '../users';
import { ILivechatRoom } from './ILivechatRoom';
import {IVisitor} from './IVisitor';

export interface ILivechatEventContext {
    agent: IUser;
    room: ILivechatRoom;
    visitor?: IVisitor;
}
