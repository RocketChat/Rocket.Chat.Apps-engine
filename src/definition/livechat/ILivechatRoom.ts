import { RoomType } from '../rooms';
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

interface IOmnichannelSourceApp {
    type: 'app';
    id: string;
    // A human readable alias that goes with the ID, for post analytical purposes
    alias?: string;
    // A label to be shown in the room info
    label?: string;
    sidebarIcon?: string;
    defaultIcon?: string;
}
type OmnichannelSource =
    | {
          type: Omit<OmnichannelSourceType, 'app'>;
      }
    | IOmnichannelSourceApp;

export interface ILivechatRoom extends IRoom {
    visitor: IVisitor;
    department?: IDepartment;
    servedBy?: IUser;
    responseBy?: IUser;
    isWaitingResponse: boolean;
    isOpen: boolean;
    closedAt?: Date;
    source?: OmnichannelSource;
}

export const isLivechatRoom = (room: IRoom): room is ILivechatRoom => {
    return room.type === RoomType.LIVE_CHAT;
};
export const isLivechatFromApp = (
    room: ILivechatRoom,
): room is ILivechatRoom & { source: IOmnichannelSourceApp } => {
    return room.source && room.source.type === 'app';
};
