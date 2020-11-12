import { IMessage } from '../../definition/messages';
import { AppInterface } from '../../definition/metadata';
import { IRoom } from '../../definition/rooms';
import { IUIKitIncomingInteraction } from '../../definition/uikit';

export interface IListenerBridge {
    name: string;
    messageEvent(int: AppInterface, message: IMessage): Promise<void | boolean | IMessage>;
    roomEvent(int: AppInterface, room: IRoom): Promise<void | boolean | IRoom>;
    uiKitInteractionEvent(int: AppInterface, action: IUIKitIncomingInteraction): Promise<void | boolean>;
}
