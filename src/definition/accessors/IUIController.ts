import { IUIKitViewResponse } from '../../definition/uikit';

export interface IUIController {
    openModalView(data: IUIKitViewResponse): Promise<void>;
}
