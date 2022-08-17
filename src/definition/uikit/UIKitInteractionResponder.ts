import { Omit } from '../../lib/utils';
import { IUIKitErrorInteractionParam } from '../accessors/IUIController';
import { IUIKitContextualBarResponse, IUIKitErrorResponse, IUIKitModalResponse, IUIKitResponse, UIKitInteractionType } from './IUIKitInteractionType';
import { IUIKitSurface } from './IUIKitSurface';
import { IUIKitBaseIncomingInteraction } from './UIKitIncomingInteractionTypes';
import { formatContextualBarInteraction, formatModalInteraction } from './UIKitInteractionPayloadFormatter';

export type IUIKitModalViewParam = Omit<IUIKitSurface, 'appId' | 'id' | 'type'> & Partial<Pick<IUIKitSurface, 'id'>>;
export type IUIKitContextualBarViewParam = Omit<IUIKitSurface, 'appId' | 'id' | 'type'> & Partial<Pick<IUIKitSurface, 'id'>>;

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

    public openContextualBarViewResponse(viewData: IUIKitContextualBarViewParam): IUIKitContextualBarResponse {
        const { appId, triggerId } = this.baseContext;

        return {
            success: true,
            ...formatContextualBarInteraction(viewData, { appId, triggerId, type: UIKitInteractionType.CONTEXTUAL_BAR_OPEN }),
        };
    }

    public updateContextualBarViewResponse(viewData: IUIKitContextualBarViewParam): IUIKitContextualBarResponse {
        const { appId, triggerId } = this.baseContext;

        return {
            success: true,
            ...formatContextualBarInteraction(viewData, { appId, triggerId, type: UIKitInteractionType.CONTEXTUAL_BAR_UPDATE }),
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
