import { IVisitor } from '../../livechat';
import { IMessage } from '../../messages';
import { IRoom } from '../../rooms';
import { UIKitIncomingInteractionType } from '../IUIKitIncomingInteraction';
import {
    IUIKitIncomingInteractionMessageContainer,
    IUIKitIncomingInteractionModalContainer,
} from '../UIKitIncomingInteractionContainer';

export interface IUIKitLivechatIncomingInteraction {
    type: UIKitIncomingInteractionType;
    container: IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionMessageContainer;
    visitor: IVisitor;
    appId: string;
    payload: object;
    actionId?: string;
    triggerId?: string;
    room?: IRoom;
    message?: IMessage;
}
