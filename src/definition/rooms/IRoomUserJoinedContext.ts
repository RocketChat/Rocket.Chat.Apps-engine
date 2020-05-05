import { IUser } from '../users';
import { IRoom } from './IRoom';

export interface IRoomUserJoinedContext {
    joiningUser: IUser;
    room: IRoom;
    invitingUser?: IUser;
}
