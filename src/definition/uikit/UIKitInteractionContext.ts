import { Omit } from '../../lib/utils';
import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IUIKitViewResponse, UIKitResponseType } from './IUIKitResponse';
import { IUIKitView } from './IUIKitView';

import uuid = require('uuid/v1');

export interface IUIKitBaseInteraction {
    appId: string;
    actionId: string;
    user: IUser;
    room: IRoom;
    triggerId?: string;
}
export interface IUIKitBlockInteraction extends IUIKitBaseInteraction {
    value?: string;
    message?: IMessage;
    triggerId: string;
}

export type IUIKitViewParam = Omit<IUIKitView, 'appId' | 'id'> & Partial<Pick<IUIKitView, 'id'>>;
export abstract class UIKitInteractionContext {
    private baseContext: IUIKitBaseInteraction;
    constructor(baseContext: IUIKitBaseInteraction) {
        const { appId, actionId, room, user, triggerId } = baseContext;

        this.baseContext = { appId, actionId, room, user, triggerId };
    }
    public modalViewResponse(viewData: IUIKitViewParam): IUIKitViewResponse {
        return {
            success: true,
            type: UIKitResponseType.MODAL,
            triggerId: this.baseContext.triggerId,
            view: {
                appId: this.baseContext.appId,
                id: viewData.id ? viewData.id : uuid(),
                ...viewData,
            },
        };
    }
}
