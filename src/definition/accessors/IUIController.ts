import { IUIKitErrorInteraction, IUIKitInteraction } from '../../definition/uikit';
import { Omit } from '../../lib/utils';
import { IUIKitContextualBar } from '../uikit/IUIKitContextualBar';
import { IUIKitModalViewParam } from '../uikit/UIKitInteractionResponder';
import { IUser } from '../users';

export type IUIKitInteractionParam = Omit<IUIKitInteraction, 'appId' | 'type'>;
export type IUIKitErrorInteractionParam = Omit<IUIKitErrorInteraction, 'type' | 'appId' | 'triggerId'>;
export type IUIKitContextualBarParam = Omit<IUIKitContextualBar, 'id'> & Partial<Pick<IUIKitContextualBar, 'id'>>;
export interface IUIController {
    openContextualBar(contextualBar: IUIKitContextualBarParam, context: IUIKitInteractionParam, user: IUser): Promise<void>;
    openModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser): Promise<void>;
    updateModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser): Promise<void>;
    setViewError(errorInteraction: IUIKitErrorInteractionParam, context: IUIKitInteractionParam, user: IUser): Promise<void>;
}
