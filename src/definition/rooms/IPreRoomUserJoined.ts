import { IHttp, IPersistence, IRead } from '../accessors';
import { AppsEngineError } from '../errors';
import { IRoomUserJoinedContext } from './IRoomUserJoinedContext';

export interface IPreRoomUserJoined {
    executePreRoomUserJoined(context: IRoomUserJoinedContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}

export class UserCannotJoinError extends AppsEngineError {}
