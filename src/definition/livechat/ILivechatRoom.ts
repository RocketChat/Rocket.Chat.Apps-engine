import { IRoom } from '../rooms/IRoom';
import { IUser } from '../users';
import { IDepartment } from './IDepartment';
import { IVisitor } from './IVisitor';

export interface ILivechatRoom extends IRoom {
    visitor: IVisitor;
    department?: IDepartment;
    servedBy?: IUser;
    responseBy?: IUser;
    isWaitingResponse: boolean;
    isOpen: boolean;
    closedAt?: Date;
}
