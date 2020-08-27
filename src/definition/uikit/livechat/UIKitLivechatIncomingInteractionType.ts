import { IVisitor } from '../../livechat';
import { IMessage } from '../../messages';
import { IRoom } from '../../rooms';
import {
    IUIKitIncomingInteractionMessageContainer,
    IUIKitIncomingInteractionModalContainer,
} from '../UIKitIncomingInteractionContainer';

export interface IUIKitLivechatBaseIncomingInteraction {
    appId: string;
    visitor: IVisitor;
    actionId?: string;
    room?: IRoom;
    triggerId?: string;
}

export interface IUIKitLivechatBlockIncomingInteraction extends IUIKitLivechatBaseIncomingInteraction {
    value?: string;
    message?: IMessage;
    triggerId: string;
    actionId: string;
    blockId: string;
    room: IUIKitLivechatBaseIncomingInteraction['room'];
    container: IUIKitIncomingInteractionModalContainer | IUIKitIncomingInteractionMessageContainer;
}
