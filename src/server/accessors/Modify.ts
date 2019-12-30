import {
    IModify,
    IModifyCreator,
    IModifyExtender,
    IModifyUpdater,
    INotifier,
    IUIController,
} from '../../definition/accessors';
import { AppBridges } from '../bridges';
import { ModifyCreator } from './ModifyCreator';
import { ModifyExtender } from './ModifyExtender';
import { ModifyUpdater } from './ModifyUpdater';
import { Notifier } from './Notifier';
import { UIController } from './UIController';

export class Modify implements IModify {
    private creator: IModifyCreator;
    private updater: IModifyUpdater;
    private extender: IModifyExtender;
    private notifier: INotifier;
    private uiController: IUIController;

    constructor(private readonly bridges: AppBridges, private readonly appId: string) {
        this.creator = new ModifyCreator(this.bridges, this.appId);
        this.updater = new ModifyUpdater(this.bridges, this.appId);
        this.extender = new ModifyExtender(this.bridges, this.appId);
        this.notifier = new Notifier(this.bridges.getMessageBridge(), this.appId);
        this.uiController = new UIController(this.appId, this.bridges);
    }

    public getCreator(): IModifyCreator {
        return this.creator;
    }

    public getUpdater(): IModifyUpdater {
        return this.updater;
    }

    public getExtender(): IModifyExtender {
        return this.extender;
    }

    public getNotifier(): INotifier {
        return this.notifier;
    }

    public getUiController(): IUIController {
        return this.uiController;
    }
}
