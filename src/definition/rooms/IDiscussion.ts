import { IRoom } from './IRoom';

export interface IDiscussion extends IRoom {
    parentRoom: IRoom;
}
