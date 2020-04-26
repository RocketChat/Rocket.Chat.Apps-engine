import { IUIKitErrorInteractionParam } from '../accessors/IUIController';
import { IUIKitContextualBarInteraction, IUIKitErrorInteraction, IUIKitInteraction, IUIKitModalInteraction, UIKitInteractionType } from './IUIKitInteractionType';
import { UIKitViewType } from './IUIKitView';
import { IUIKitContextualBarViewParam, IUIKitModalViewParam } from './UIKitInteractionResponder';

import uuid = require('uuid/v1');

export function formatModalInteraction(view: IUIKitModalViewParam, context: IUIKitInteraction): IUIKitModalInteraction {
    if (![UIKitInteractionType.MODAL_OPEN, UIKitInteractionType.MODAL_UPDATE, UIKitInteractionType.MODAL_CLOSE].includes(context.type)) {
        throw new Error(`Invalid type "${ context.type }" for modal interaction`);
    }

    const type = context.type as UIKitInteractionType.MODAL_OPEN | UIKitInteractionType.MODAL_UPDATE | UIKitInteractionType.MODAL_CLOSE;

    return {
        type,
        triggerId: context.triggerId,
        appId: context.appId,
        view: {
            appId: context.appId,
            type: UIKitViewType.MODAL,
            id: view.id ? view.id : uuid(),
            ...view,
        },
    };
}

export function formatContextualBarInteraction(view: IUIKitContextualBarViewParam, context: IUIKitInteraction): IUIKitContextualBarInteraction {
    if (![UIKitInteractionType.CONTEXTUAL_BAR_OPEN].includes(context.type)) {
        throw new Error(`Invalid type "${ context.type }" for contextual bar interaction`);
    }

    const type = context.type as UIKitInteractionType.CONTEXTUAL_BAR_OPEN;

    return {
        type,
        triggerId: context.triggerId,
        appId: context.appId,
        view: {
            appId: context.appId,
            type: UIKitViewType.CONTEXTUAL_BAR,
            id: view.id ? view.id : uuid(),
            ...view,
        },
    };
}

export function formatErrorInteraction(errorInteraction: IUIKitErrorInteractionParam, context: IUIKitInteraction): IUIKitErrorInteraction {
    if (UIKitInteractionType.ERRORS !== context.type) {
        throw new Error(`Invalid type "${ context.type }" for error interaction`);
    }

    return {
        appId: context.appId,
        type: UIKitInteractionType.ERRORS,
        errors: errorInteraction.errors,
        viewId: errorInteraction.viewId,
        triggerId: context.triggerId,
    };
}
