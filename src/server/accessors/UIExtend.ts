import { IUIExtend } from '../../definition/accessors';
import { IUIActionButtonDescriptor } from '../../definition/ui';
import { UIActionButtonManager } from '../managers/UIActionButtonManager';

export class UIExtend implements IUIExtend {
    constructor(private readonly manager: UIActionButtonManager, private readonly appId: string) { }
    public registerButton(button: IUIActionButtonDescriptor): void {
        this.manager.registerActionButton(this.appId, button);
    }

}
