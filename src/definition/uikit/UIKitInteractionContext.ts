// tslint:disable:max-classes-per-file

import { Omit } from '../../lib/utils';
import { IMessage } from '../messages';
import { IRoom } from '../rooms';
import { IUser } from '../users';
import { IUIKitResponse, IUIKitViewResponse, UIKitResponseType } from './IUIKitResponse';
import { IUIKitView } from './IUIKitView';

import uuid = require('uuid/v1');

export interface IUIKitBaseInteraction {
    appId: string;
    actionId: string;
    user: IUser;
    room?: IRoom;
    triggerId?: string;
}
export interface IUIKitBlockInteraction extends IUIKitBaseInteraction {
    value?: string;
    message?: IMessage;
    triggerId: IUIKitBaseInteraction['triggerId'];
    room: IUIKitBaseInteraction['room'];
}

export interface IUIKitViewSubmitInteraction extends IUIKitBlockInteraction {
    view: IUIKitView;
}

export interface IUIKitViewCloseInteraction extends IUIKitBaseInteraction {
    view: IUIKitView;
    isCleared: boolean;
}

export type IUIKitViewParam = Omit<IUIKitView, 'appId' | 'id'> & Partial<Pick<IUIKitView, 'id'>>;
export abstract class UIKitInteractionContext {
    private baseContext: IUIKitBaseInteraction;
    constructor(baseContext: IUIKitBaseInteraction) {
        const { appId, actionId, room, user, triggerId } = baseContext;

        this.baseContext = { appId, actionId, room, user, triggerId };
    }

    public abstract getInteractionData(): IUIKitBaseInteraction;

    public successResponse(): IUIKitResponse {
        return {
            success: true,
        };
    }

    public errorResponse(): IUIKitResponse {
        return {
            success: false,
        };
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

export class UIKitBlockInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: IUIKitBlockInteraction) {
        super(interactionData);
    }

    public getInteractionData(): IUIKitBlockInteraction {
        return this.interactionData;
    }
}

export class UIKitViewSubmitInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: IUIKitViewSubmitInteraction) {
        super(interactionData);
    }

    public getInteractionData(): IUIKitViewSubmitInteraction {
        return this.interactionData;
    }
}

export class UIKitViewCloseInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: IUIKitViewCloseInteraction) {
        super(interactionData);
    }

    public getInteractionData(): IUIKitViewCloseInteraction {
        return this.interactionData;
    }
}
