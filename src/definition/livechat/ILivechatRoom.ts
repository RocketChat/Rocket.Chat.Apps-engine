import { IRoom } from '../rooms/IRoom';
import { IUser } from '../users';
import { IDepartment } from './IDepartment';
import { IVisitor } from './IVisitor';

export enum OmnichannelSourceType {
    WIDGET = 'widget',
    EMAIL = 'email',
    SMS = 'sms',
    APP = 'app',
    OTHER = 'other',
}

export interface ILivechatRoom extends IRoom {
    visitor: IVisitor;
    department?: IDepartment;
    servedBy?: IUser;
    responseBy?: IUser;
    isWaitingResponse: boolean;
    isOpen: boolean;
    closedAt?: Date;
    source?: {
        // The source, or client, which created the Omnichannel room
        type: OmnichannelSourceType;
        // An optional identification of external sources, such as an App
        id?: string;
        // A human readable alias that goes with the ID, for post analytical purposes
        alias?: string;
    };
}
