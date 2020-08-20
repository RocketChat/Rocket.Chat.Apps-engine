import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IDepartment } from './IDepartment';

export enum LivechatTransferEventType {
    AGENT = 'agent',
    DEPARTMENT = 'department',
}

export interface ILivechatTransferEventContext {
    type: LivechatTransferEventType;
    room: IRoom;
    from: IUser | IDepartment;
    to: IUser | IDepartment;
}
