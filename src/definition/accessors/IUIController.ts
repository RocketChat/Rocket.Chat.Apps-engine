import { IUIKitInteraction } from '../../definition/uikit';
import { Omit } from '../../lib/utils';
import { IUIKitModalViewParam } from '../uikit/UIKitInteractionResponder';
import { IUser } from '../users';

export type IUIKitInteractionParam = Omit<IUIKitInteraction, 'appId' | 'type'>;

export interface IUIController {
    openModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser): Promise<void>;
    updateModalView(view: IUIKitModalViewParam, context: IUIKitInteractionParam, user: IUser): Promise<void>;
}
