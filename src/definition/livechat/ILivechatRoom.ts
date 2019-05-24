import { IRoom } from '../rooms/IRoom';
import { IUser } from '../users';
import { IVisitor } from './IVisitor';

export interface ILivechatRoom extends IRoom {
    visitor: IVisitor;
    servedBy?: IUser;
    responseBy?: IUser;
    waitingResponse: boolean;
    closed: boolean;
    closedAt?: Date;
}
