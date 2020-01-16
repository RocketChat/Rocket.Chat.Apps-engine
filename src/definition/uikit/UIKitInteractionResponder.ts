import { Omit } from '../../lib/utils';
import { IUIKitModalResponse, IUIKitResponse, UIKitInteractionType } from './IUIKitInteractionType';
import { IUIKitView } from './IUIKitView';
import { IUIKitBaseIncomingInteraction } from './UIKitIncomingInteractionTypes';

import { formatModalInteraction } from './UIKitInteractionPayloadFormatter';

export type IUIKitModalViewParam = Omit<IUIKitView, 'appId' | 'id' | 'type'> & Partial<Pick<IUIKitView, 'id'>>;

export class UIKitInteractionResponder {
    constructor(private readonly baseContext: IUIKitBaseIncomingInteraction) { }

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
    public openModalViewResponse(viewData: IUIKitModalViewParam): IUIKitModalResponse {
        const { appId, triggerId } = this.baseContext;

        return {
            success: true,
            ...formatModalInteraction(viewData, { appId, triggerId, type: UIKitInteractionType.MODAL_OPEN }),
        };
    }

    public updateModalViewResponse(viewData: IUIKitModalViewParam): IUIKitModalResponse {
        const { appId, triggerId } = this.baseContext;

        return {
            success: true,
            ...formatModalInteraction(viewData, { appId, triggerId, type: UIKitInteractionType.MODAL_OPEN }),
        };
    }
}
