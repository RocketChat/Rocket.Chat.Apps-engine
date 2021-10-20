import { IUIActionButtonDescriptor } from '../ui';

export interface IUIExtend {
    registerButton(button: IUIActionButtonDescriptor): void;
}
