import { AppInterface } from '../compiler';
import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
export interface IListenerBridge {
    messageEvent(int: AppInterface, message: IMessage): Promise<void | boolean | IMessage>;
    roomEvent(int: AppInterface, room: IRoom): Promise<void | boolean | IRoom>;
}
