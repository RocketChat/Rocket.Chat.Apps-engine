import { IHttp, IPersistence, IRead } from '../accessors';
import { IRoomUserJoinedContext } from './IRoomUserJoinedContext';

export interface IPreRoomUserJoined {
    executePreRoomUserJoined(context: IRoomUserJoinedContext, read: IRead, http: IHttp, persistence: IPersistence): Promise<void>;
}
