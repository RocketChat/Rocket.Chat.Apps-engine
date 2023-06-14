import { IMessage } from '../../definition/messages';
import { AppInterface } from '../../definition/metadata';
import { IRoom } from '../../definition/rooms';
import { UIKitIncomingInteraction } from '../../definition/uikit';

export interface IListenerBridge {
    messageEvent(int: AppInterface, message: IMessage): Promise<void | boolean | IMessage>;
    roomEvent(int: AppInterface, room: IRoom): Promise<void | boolean | IRoom>;
    uiKitInteractionEvent(int: AppInterface, action: UIKitIncomingInteraction): Promise<void | boolean>;
}
