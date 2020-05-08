import { IHttp, IPersistence, IRead } from '../accessors';
import { AppsEngineException } from '../exceptions';
import { IRoomUserJoinedContext } from './IRoomUserJoinedContext';

export interface IPreRoomUserJoined {
    executePreRoomUserJoined(context: IRoomUserJoinedContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}

export class UserNotAllowedJoinException extends AppsEngineException {}
