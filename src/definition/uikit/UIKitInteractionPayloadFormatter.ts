import { IUIKitErrorInteractionParam } from '../accessors/IUIController';
import { IUIKitErrorInteraction, IUIKitInteraction, IUIKitModalInteraction, UIKitInteractionType } from './IUIKitInteractionType';
import { IUIKitView, UIKitViewType } from './IUIKitView';
import { IUIKitModalViewParam } from './UIKitInteractionResponder';

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
            showIcon: true,
        } as IUIKitView,
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
