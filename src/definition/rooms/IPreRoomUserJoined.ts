import { IHttp, IPersistence, IRead } from '../accessors';
import { AppsEngineError } from '../errors';
import { IUser } from '../users';
import { IRoom } from './IRoom';

export interface IPreRoomUserJoined {
    executePreRoomUserJoined(context: IPreRoomUserJoinedContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}

export interface IPreRoomUserJoinedContext {
    joiningUser: IUser;
    room: IRoom;
    invitingUser?: IUser;
}

export class UserCannotJoinError extends AppsEngineError {}
