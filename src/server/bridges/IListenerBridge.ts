import { IMessage } from '../../definition/messages';
import { IRoom } from '../../definition/rooms';
import { IUIKitIncomingInteraction } from '../../definition/uikit';
import { AppInterface } from '../compiler';

export interface IListenerBridge {
    messageEvent(int: AppInterface, message: IMessage): Promise<void | boolean | IMessage>;
    roomEvent(int: AppInterface, room: IRoom): Promise<void | boolean | IRoom>;
    uiKitInteractionEvent(int: AppInterface, action: IUIKitIncomingInteraction): Promise<void | boolean>;
}
