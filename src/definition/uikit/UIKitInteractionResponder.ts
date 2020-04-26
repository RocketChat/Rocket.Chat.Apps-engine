import { Omit } from '../../lib/utils';
import { IUIKitErrorInteractionParam } from '../accessors/IUIController';
import { IUIKitContextualBarResponse, IUIKitErrorResponse, IUIKitModalResponse, IUIKitResponse, UIKitInteractionType } from './IUIKitInteractionType';
import { IUIKitView } from './IUIKitView';
import { IUIKitBaseIncomingInteraction } from './UIKitIncomingInteractionTypes';
import { formatContextualBarInteraction, formatModalInteraction } from './UIKitInteractionPayloadFormatter';

export type IUIKitModalViewParam = Omit<IUIKitView, 'appId' | 'id' | 'type'> & Partial<Pick<IUIKitView, 'id'>>;
export type IUIKitContextualBarViewParam = Omit<IUIKitView, 'appId' | 'id' | 'type'> & Partial<Pick<IUIKitView, 'id'>>;

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
            ...formatModalInteraction(viewData, { appId, triggerId, type: UIKitInteractionType.MODAL_UPDATE }),
        };
    }

    public openContextualBarResponse(viewData: IUIKitContextualBarViewParam): IUIKitContextualBarResponse {
        const { appId, triggerId } = this.baseContext;

        return {
            success: true,
            ...formatContextualBarInteraction(viewData, { appId, triggerId, type: UIKitInteractionType.CONTEXTUAL_BAR_OPEN }),
        };
    }

    public viewErrorResponse(errorInteraction: IUIKitErrorInteractionParam): IUIKitErrorResponse {
        const { appId, triggerId } = this.baseContext;

        return {
            appId,
            triggerId,
            success: false,
            type: UIKitInteractionType.ERRORS,
            viewId: errorInteraction.viewId,
            errors: errorInteraction.errors,
        };
    }
}
